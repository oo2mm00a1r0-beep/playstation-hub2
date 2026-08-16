/*
# Add admin (authenticated) policies for dashboard management

1. Security changes
- products: authenticated users can SELECT all (including sold), INSERT, UPDATE, DELETE.
- orders: authenticated users can SELECT all and UPDATE (payment status).
- sell_submissions: authenticated users can SELECT all and UPDATE (status).
- offers: authenticated users can SELECT all (including inactive), INSERT, UPDATE, DELETE.

2. Important Notes
- The public storefront keeps its existing anon read/insert policies.
- These new policies allow an admin (signed in via Supabase email/password auth) to manage all data from the dashboard.
- No user_id ownership is needed because admin access is global; any authenticated user is treated as admin for now.
*/

DROP POLICY IF EXISTS "admin_select_all_products" ON products;
CREATE POLICY "admin_select_all_products" ON products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders" ON orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_sell_submissions" ON sell_submissions;
CREATE POLICY "admin_select_sell_submissions" ON sell_submissions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_sell_submissions" ON sell_submissions;
CREATE POLICY "admin_update_sell_submissions" ON sell_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_all_offers" ON offers;
CREATE POLICY "admin_select_all_offers" ON offers FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_offers" ON offers;
CREATE POLICY "admin_insert_offers" ON offers FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_offers" ON offers;
CREATE POLICY "admin_update_offers" ON offers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_offers" ON offers;
CREATE POLICY "admin_delete_offers" ON offers FOR DELETE TO authenticated USING (true);
