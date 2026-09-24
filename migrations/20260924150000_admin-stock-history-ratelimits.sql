-- =====================================================================
-- 1. Admins
-- Rows are added by the project owner via the CLI only; no client access.
-- =====================================================================
CREATE TABLE public.admins (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admins FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Admins can read orders and every form submission.
CREATE POLICY "admins read all orders" ON public.orders
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

CREATE POLICY "admins read newsletter" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "admins read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "admins read b2b inquiries" ON public.b2b_inquiries
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "admins read restaurant inquiries" ON public.restaurant_inquiries
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));

GRANT SELECT ON public.newsletter_subscribers, public.contact_messages,
  public.b2b_inquiries, public.restaurant_inquiries TO authenticated;

-- =====================================================================
-- 2. Stock
-- NULL stock_quantity = not tracked. Maintained by the order trigger below;
-- admins may set it (and availability/copy) but not prices, which must
-- stay in sync with Stripe.
-- =====================================================================
ALTER TABLE public.products
  ADD COLUMN stock_quantity INTEGER CHECK (stock_quantity IS NULL OR stock_quantity >= 0);

CREATE POLICY "admins update products" ON public.products
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

GRANT UPDATE (stock_quantity, in_stock, descriptor, sort_order) ON public.products TO authenticated;

-- =====================================================================
-- 3. Order lifecycle + append-only status history
-- =====================================================================
ALTER TABLE public.orders
  ADD COLUMN tracking_number TEXT,
  ADD COLUMN shipped_at      TIMESTAMPTZ,
  ADD COLUMN delivered_at    TIMESTAMPTZ,
  ADD COLUMN cancelled_at    TIMESTAMPTZ,
  -- Transient: set by admin_update_order_status, copied into the history
  -- row and cleared by the BEFORE UPDATE trigger. Never persisted.
  ADD COLUMN status_note     TEXT;

CREATE TABLE public.order_status_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  note         TEXT,
  changed_by   UUID,          -- admin user id; NULL = system (checkout / Stripe webhook)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX order_status_history_order_idx ON public.order_status_history (order_id, created_at);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_order(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders WHERE id = p_order_id AND user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.owns_order(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.owns_order(UUID) TO authenticated;

CREATE POLICY "customers and admins read order history" ON public.order_status_history
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()) OR public.owns_order(order_id));

REVOKE ALL ON public.order_status_history FROM anon, authenticated;
GRANT SELECT ON public.order_status_history TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_history_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'order_status_history is append-only';
END;
$$;

CREATE TRIGGER order_status_history_append_only
  BEFORE UPDATE OR DELETE ON public.order_status_history
  FOR EACH ROW EXECUTE FUNCTION public.prevent_history_changes();

-- Initial history row when an order is created.
CREATE OR REPLACE FUNCTION public.on_order_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  INSERT INTO public.order_status_history (order_id, from_status, to_status, changed_by)
  VALUES (NEW.id, NULL, NEW.status, auth.uid());
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_order_created() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER orders_created_history
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_created();

-- Logs every status change and keeps stock in step with paid/cancelled orders.
CREATE OR REPLACE FUNCTION public.on_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_item  JSONB;
  v_delta INTEGER := 0;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    NEW.status_note := NULL;
    RETURN NEW;
  END IF;

  INSERT INTO public.order_status_history (order_id, from_status, to_status, note, changed_by)
  VALUES (NEW.id, OLD.status, NEW.status, NULLIF(left(NEW.status_note, 500), ''), auth.uid());
  NEW.status_note := NULL;

  IF NEW.status = 'paid' AND OLD.status IN ('pending', 'expired') THEN
    v_delta := -1;
  ELSIF NEW.status = 'cancelled' AND OLD.status IN ('paid', 'shipped') THEN
    v_delta := 1;
  END IF;

  IF v_delta <> 0 THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
      UPDATE public.products
      SET stock_quantity = GREATEST(0, stock_quantity + v_delta * (v_item ->> 'quantity')::int),
          in_stock = CASE
            WHEN GREATEST(0, stock_quantity + v_delta * (v_item ->> 'quantity')::int) = 0 THEN false
            WHEN v_delta > 0 THEN true
            ELSE in_stock
          END
      WHERE slug = v_item ->> 'productId'
        AND stock_quantity IS NOT NULL;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_order_status_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER orders_status_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_status_change();

-- The only way for an admin to move an order along.
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
  p_order_id        UUID,
  p_status          TEXT,
  p_tracking_number TEXT DEFAULT NULL,
  p_note            TEXT DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_order public.orders;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'order not found' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (
       (v_order.status = 'paid'    AND p_status IN ('shipped', 'cancelled'))
    OR (v_order.status = 'shipped' AND p_status IN ('delivered', 'cancelled'))
    OR (v_order.status = 'pending' AND p_status = 'cancelled')
  ) THEN
    RAISE EXCEPTION 'cannot change order from % to %', v_order.status, p_status
      USING ERRCODE = '22023';
  END IF;

  UPDATE public.orders
  SET status          = p_status,
      tracking_number = COALESCE(NULLIF(trim(p_tracking_number), ''), tracking_number),
      shipped_at      = CASE WHEN p_status = 'shipped'   THEN NOW() ELSE shipped_at END,
      delivered_at    = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END,
      cancelled_at    = CASE WHEN p_status = 'cancelled' THEN NOW() ELSE cancelled_at END,
      status_note     = p_note
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_update_order_status(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_order_status(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- =====================================================================
-- 4. Spam protection for the public forms
-- Per email: max 3 submissions/hour. Per form: max 60 submissions/10 min.
-- Plus length/format limits so a single row can't be abused.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.enforce_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_per_email INTEGER;
  v_recent    INTEGER;
BEGIN
  EXECUTE format(
    'SELECT count(*) FILTER (WHERE lower(email) = lower($1) AND created_at > now() - interval ''1 hour''),
            count(*) FILTER (WHERE created_at > now() - interval ''10 minutes'')
     FROM public.%I', TG_TABLE_NAME)
  INTO v_per_email, v_recent
  USING NEW.email;

  IF v_per_email >= 3 OR v_recent >= 60 THEN
    RAISE EXCEPTION 'rate_limited: too many submissions, please try again later'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_form_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER contact_messages_rate_limit BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE TRIGGER b2b_inquiries_rate_limit BEFORE INSERT ON public.b2b_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE TRIGGER restaurant_inquiries_rate_limit BEFORE INSERT ON public.restaurant_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE TRIGGER newsletter_subscribers_rate_limit BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();

CREATE INDEX contact_messages_email_idx       ON public.contact_messages (lower(email), created_at);
CREATE INDEX b2b_inquiries_email_idx          ON public.b2b_inquiries (lower(email), created_at);
CREATE INDEX restaurant_inquiries_email_idx   ON public.restaurant_inquiries (lower(email), created_at);
CREATE INDEX newsletter_subscribers_created_idx ON public.newsletter_subscribers (created_at);

ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254);

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254),
  ADD CONSTRAINT contact_lengths CHECK (
    length(name) <= 200 AND length(coalesce(subject, '')) <= 200 AND length(message) <= 5000
  );

ALTER TABLE public.b2b_inquiries
  ADD CONSTRAINT b2b_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254),
  ADD CONSTRAINT b2b_lengths CHECK (
    length(business_name) <= 200 AND length(contact_name) <= 200
    AND length(coalesce(phone, '')) <= 40 AND length(coalesce(message, '')) <= 5000
  );

ALTER TABLE public.restaurant_inquiries
  ADD CONSTRAINT restaurant_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254),
  ADD CONSTRAINT restaurant_lengths CHECK (
    length(restaurant_name) <= 200 AND length(contact_name) <= 200
    AND length(coalesce(phone, '')) <= 40 AND length(coalesce(city, '')) <= 100
    AND length(coalesce(message, '')) <= 5000
  );
