-- Stripe Checkout Sessions must be created with the visitor's own token
-- (anon or signed-in) — InsForge rejects the admin API key. Checkout is
-- therefore gated by RLS: a visitor may only open a session for a fresh
-- pending order, with exactly the Stripe line items the server priced for it.

-- Line items the server priced for this order, normalised to
-- [{"price": "...", "quantity": n}] sorted by price. Written with the admin key.
ALTER TABLE public.orders
  ADD COLUMN checkout_line_items JSONB;

CREATE OR REPLACE FUNCTION public.normalize_stripe_line_items(p_items JSONB)
RETURNS JSONB
LANGUAGE sql IMMUTABLE
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'price', COALESCE(e ->> 'priceId', e ->> 'price'),
        'quantity', (e ->> 'quantity')::int
      )
      ORDER BY COALESCE(e ->> 'priceId', e ->> 'price')
    ),
    '[]'::jsonb
  )
  FROM jsonb_array_elements(COALESCE(p_items, '[]'::jsonb)) AS e;
$$;

CREATE OR REPLACE FUNCTION public.can_start_order_checkout(
  p_environment     TEXT,
  p_mode            TEXT,
  p_subject_type    TEXT,
  p_subject_id      TEXT,
  p_idempotency_key TEXT,
  p_line_items      JSONB,
  p_metadata        JSONB
)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT p_mode = 'payment'
    AND EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id::text = p_metadata ->> 'order_id'
        AND o.status = 'pending'
        AND o.stripe_environment = p_environment
        AND o.created_at > NOW() - INTERVAL '1 hour'
        AND p_idempotency_key = 'order:' || o.id::text
        AND o.checkout_line_items = public.normalize_stripe_line_items(p_line_items)
        AND (
          p_subject_type IS NULL
          OR (p_subject_type = 'user'
              AND p_subject_id = auth.uid()::text
              AND o.user_id = auth.uid())
        )
    );
$$;

REVOKE EXECUTE ON FUNCTION public.can_start_order_checkout(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_start_order_checkout(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, JSONB) TO anon, authenticated;

-- The payments schema is not exposed over the REST API, so these rows are
-- only reachable through InsForge's checkout endpoint.
GRANT USAGE ON SCHEMA payments TO anon, authenticated;
GRANT SELECT, INSERT ON payments.stripe_checkout_sessions TO anon, authenticated;

CREATE POLICY "visitors start checkout for their pending order"
  ON payments.stripe_checkout_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (public.can_start_order_checkout(
    environment, mode, subject_type, subject_id, idempotency_key, line_items, metadata));

-- Needed for INSERT ... RETURNING and idempotent retries.
CREATE POLICY "visitors read checkout for their pending order"
  ON payments.stripe_checkout_sessions
  FOR SELECT TO anon, authenticated
  USING (public.can_start_order_checkout(
    environment, mode, subject_type, subject_id, idempotency_key, line_items, metadata));

-- Fulfillment: additionally require that Stripe charged what the order is
-- worth, so a session can never mark a more expensive order as paid.
CREATE OR REPLACE FUNCTION public.fulfill_stripe_order()
RETURNS TRIGGER AS $$
DECLARE
  v_session  JSONB := NEW.payload -> 'data' -> 'object';
  v_order_id TEXT  := NEW.payload -> 'data' -> 'object' -> 'metadata' ->> 'order_id';
BEGIN
  IF NEW.provider <> 'stripe'
     OR NEW.processing_status <> 'processed'
     OR v_order_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF (NEW.event_type = 'checkout.session.completed' AND v_session ->> 'payment_status' = 'paid')
     OR NEW.event_type = 'checkout.session.async_payment_succeeded' THEN
    UPDATE public.orders
    SET status = 'paid',
        paid_at = COALESCE(NEW.processed_at, NOW()),
        stripe_checkout_session_id = v_session ->> 'id'
    WHERE id::text = v_order_id
      AND status IN ('pending', 'expired')
      AND round(subtotal * 100) = (v_session ->> 'amount_total')::numeric
      AND lower(currency) = lower(v_session ->> 'currency');

    IF NOT FOUND AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE id::text = v_order_id AND status IN ('pending', 'expired')
    ) THEN
      RAISE WARNING 'Stripe event % paid % % for order %, which does not match its total',
        NEW.provider_event_id, v_session ->> 'amount_total', v_session ->> 'currency', v_order_id;
    END IF;
  ELSIF NEW.event_type IN ('checkout.session.expired', 'checkout.session.async_payment_failed') THEN
    UPDATE public.orders
    SET status = 'expired'
    WHERE id::text = v_order_id
      AND status = 'pending';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.fulfill_stripe_order() FROM PUBLIC, anon, authenticated;
