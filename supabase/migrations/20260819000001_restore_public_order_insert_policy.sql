ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_create_orders" ON orders;
CREATE POLICY "public_create_orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
