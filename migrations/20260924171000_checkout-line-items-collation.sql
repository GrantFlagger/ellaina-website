-- Sort by byte order so the result matches the JS sort in /api/checkout
-- (locale collation orders mixed-case Stripe IDs differently).
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
      ORDER BY COALESCE(e ->> 'priceId', e ->> 'price') COLLATE "C"
    ),
    '[]'::jsonb
  )
  FROM jsonb_array_elements(COALESCE(p_items, '[]'::jsonb)) AS e;
$$;
