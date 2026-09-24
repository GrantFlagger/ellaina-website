-- B2B inquiries (/b2b form)
CREATE TABLE public.b2b_inquiries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name  TEXT NOT NULL,
  contact_name   TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  message        TEXT,
  language       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.b2b_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can send a b2b inquiry" ON public.b2b_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

REVOKE SELECT, UPDATE, DELETE ON public.b2b_inquiries FROM anon, authenticated;
GRANT INSERT ON public.b2b_inquiries TO anon, authenticated;

-- Restaurant inquiries (/b2b/restaurants form)
CREATE TABLE public.restaurant_inquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name  TEXT NOT NULL,
  contact_name     TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  city             TEXT,
  message          TEXT,
  language         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.restaurant_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can send a restaurant inquiry" ON public.restaurant_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

REVOKE SELECT, UPDATE, DELETE ON public.restaurant_inquiries FROM anon, authenticated;
GRANT INSERT ON public.restaurant_inquiries TO anon, authenticated;
