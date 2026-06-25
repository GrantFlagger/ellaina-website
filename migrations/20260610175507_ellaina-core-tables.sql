-- Newsletter signups (footer form)
CREATE TABLE public.newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  language    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.newsletter_subscribers FROM anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;

-- Contact form submissions
CREATE TABLE public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can send a message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;

-- Product catalog
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  volume      TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'EUR',
  descriptor  TEXT,
  image       TEXT,
  in_stock    BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can view products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.products TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon, authenticated;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- Seed the current catalog
INSERT INTO public.products (slug, name, volume, price, descriptor, image, sort_order) VALUES
  ('500ml', 'Bottle',     '500 ml', 13.00, 'Balanced flavour with a rich olive aroma. Perfect for everyday use at the table.', '/images/bottle-warm.png', 1),
  ('750ml', 'Bottle',     '750 ml', 17.00, 'Full of character with a smooth texture and fruity aftertaste. The ideal size for families.', '/images/bottle-classic.png', 2),
  ('5L',    'Litre Can',  '5 L',    50.00, 'Premium extra virgin olive oil in a family-size tin. The perfect choice for bulk use and great value.', NULL, 3);
