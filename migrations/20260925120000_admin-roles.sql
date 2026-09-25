-- =====================================================================
-- Admin roles: super_admin | admin
-- Granted by email, so access can be set up before the person registers;
-- it takes effect once they sign up and verify that address.
-- Super admins additionally manage the admin list and can delete
-- orders and form submissions. Super admins are added via the CLI only.
-- =====================================================================
DROP TABLE public.admins;

CREATE TABLE public.admins (
  email       TEXT PRIMARY KEY CHECK (email = lower(btrim(email)) AND email LIKE '%_@_%._%'),
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  added_by    UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admins FROM anon, authenticated;

-- Role of the signed-in user, or NULL. Unverified emails never count.
CREATE OR REPLACE FUNCTION public.admin_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT a.role
  FROM public.admins a
  JOIN auth.users u ON lower(u.email) = a.email
  WHERE u.id = auth.uid() AND u.email_verified;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.admin_role() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.admin_role() IS NOT DISTINCT FROM 'super_admin';
$$;

REVOKE EXECUTE ON FUNCTION public.admin_role()     FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin()       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_role()     TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()       TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ---------------------------------------------------------------------
-- Admin list management (super admins only)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_list_admins()
RETURNS TABLE (email TEXT, role TEXT, registered BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT a.email, a.role,
         EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = a.email AND u.email_verified),
         a.created_at
  FROM public.admins a
  ORDER BY a.role DESC, a.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_add_admin(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_email TEXT := lower(btrim(p_email));
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;
  IF v_email IS NULL OR v_email NOT LIKE '%_@_%._%' OR length(v_email) > 254 THEN
    RAISE EXCEPTION 'invalid email' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.admins (email, role, added_by)
  VALUES (v_email, 'admin', auth.uid())
  ON CONFLICT (email) DO NOTHING;
END;
$$;

-- Removes an admin. Super admin rows can only be changed via the CLI.
CREATE OR REPLACE FUNCTION public.admin_remove_admin(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.admins WHERE email = lower(btrim(p_email)) AND role = 'admin';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'admin not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------
-- Deletes (super admins only)
-- ---------------------------------------------------------------------

-- History stays append-only, except that it goes along with its order
-- when admin_delete_order removes one (the cascade runs after the order
-- row is gone, so that is the only case where the order is missing).
ALTER TABLE public.order_status_history
  DROP CONSTRAINT order_status_history_order_id_fkey,
  ADD CONSTRAINT order_status_history_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.prevent_history_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'DELETE' AND NOT EXISTS (SELECT 1 FROM public.orders WHERE id = OLD.order_id) THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'order_status_history is append-only';
END;
$$;

-- Only cancelled or expired orders: paid/shipped/delivered orders are
-- financial records, and a pending one may still be paid by Stripe.
CREATE OR REPLACE FUNCTION public.admin_delete_order(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_status TEXT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;

  SELECT status INTO v_status FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'order not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_status NOT IN ('cancelled', 'expired') THEN
    RAISE EXCEPTION 'only cancelled or expired orders can be deleted' USING ERRCODE = '22023';
  END IF;

  DELETE FROM public.orders WHERE id = p_order_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_submission(p_kind TEXT, p_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'not allowed' USING ERRCODE = '42501';
  END IF;

  CASE p_kind
    WHEN 'contact'    THEN DELETE FROM public.contact_messages       WHERE id = p_id;
    WHEN 'b2b'        THEN DELETE FROM public.b2b_inquiries          WHERE id = p_id;
    WHEN 'restaurant' THEN DELETE FROM public.restaurant_inquiries   WHERE id = p_id;
    WHEN 'newsletter' THEN DELETE FROM public.newsletter_subscribers WHERE id = p_id;
    ELSE RAISE EXCEPTION 'unknown submission kind' USING ERRCODE = '22023';
  END CASE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'submission not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prevent_history_changes()             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_admins()                   FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_add_admin(TEXT)                 FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_remove_admin(TEXT)              FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_order(UUID)              FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_submission(TEXT, UUID)   FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_admins()                   TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_add_admin(TEXT)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_remove_admin(TEXT)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_order(UUID)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_submission(TEXT, UUID)   TO authenticated;

-- ---------------------------------------------------------------------
-- Seed the initial admins
-- ---------------------------------------------------------------------
INSERT INTO public.admins (email, role) VALUES
  ('kalaitzismich@gmail.com', 'super_admin'),
  ('mirtokal10@gmail.com',    'admin'),
  ('theomaranos@hotmail.com', 'admin');
