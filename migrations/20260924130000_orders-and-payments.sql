-- Stripe Price IDs per product, one per Stripe environment
ALTER TABLE public.products
  ADD COLUMN stripe_price_test TEXT,
  ADD COLUMN stripe_price_live TEXT;

-- Orders: created server-side (admin key) when checkout starts, marked paid
-- by the Stripe webhook trigger below. Customers can only read their own.
CREATE SEQUENCE public.order_number_seq START 1001;

CREATE TABLE public.orders (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number                TEXT NOT NULL UNIQUE
                                DEFAULT ('ELL-' || nextval('public.order_number_seq')::text),
  user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email                       TEXT NOT NULL,
  full_name                   TEXT NOT NULL,
  phone                       TEXT,
  address                     TEXT NOT NULL,
  city                        TEXT NOT NULL,
  postal_code                 TEXT NOT NULL,
  country                     TEXT NOT NULL,
  notes                       TEXT,
  items                       JSONB NOT NULL,
  subtotal                    NUMERIC(10, 2) NOT NULL,
  currency                    TEXT NOT NULL DEFAULT 'EUR',
  language                    TEXT,
  status                      TEXT NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'expired')),
  stripe_environment          TEXT,
  stripe_checkout_session_id  TEXT,
  paid_at                     TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX orders_user_id_idx ON public.orders (user_id, created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers read their own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

REVOKE ALL ON public.orders FROM anon, authenticated;
GRANT SELECT ON public.orders TO authenticated;
REVOKE ALL ON SEQUENCE public.order_number_seq FROM anon, authenticated;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- Checkout/portal sessions are only created by the Next.js server with the
-- admin key, so browsers get no direct access.
ALTER TABLE payments.stripe_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.stripe_customer_portal_sessions ENABLE ROW LEVEL SECURITY;

-- Fulfillment from verified Stripe webhooks (never from the success URL)
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
      AND status IN ('pending', 'expired');
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

CREATE TRIGGER fulfill_stripe_order_from_webhook
  AFTER INSERT OR UPDATE ON payments.webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.fulfill_stripe_order();
