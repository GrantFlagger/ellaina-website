-- Product photos live in the public "product-images" storage bucket.
-- Keep the object key alongside the URL so images can be replaced/deleted.
ALTER TABLE public.products ADD COLUMN image_key TEXT;

UPDATE public.products SET image_key = 'bottle-warm.png',    image = 'https://nrayvzs3.eu-central.insforge.app/api/storage/buckets/product-images/objects/bottle-warm.png?v=bc18f3e5c6263f739550966b331242e3'    WHERE slug = '500ml';
UPDATE public.products SET image_key = 'bottle-classic.png', image = 'https://nrayvzs3.eu-central.insforge.app/api/storage/buckets/product-images/objects/bottle-classic.png?v=f829e09af52038036e99fa73a46daec0' WHERE slug = '750ml';
UPDATE public.products SET image_key = 'ellaina_can.png',    image = 'https://nrayvzs3.eu-central.insforge.app/api/storage/buckets/product-images/objects/ellaina_can.png?v=fd260c6eb9e57b03789f59a73081d824'    WHERE slug = '5L';
