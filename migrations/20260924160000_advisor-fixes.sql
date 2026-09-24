-- Evaluate auth.uid() once per query instead of once per row.
DROP POLICY "customers read their own orders" ON public.orders;
CREATE POLICY "customers read their own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Only signed-in users ever need the admin check.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
