/*
# Create PlayStation Hub storefront data

1. New Tables
- `products` stores public catalog listings with name, console, category, condition, price, description, gallery images, and availability status.
- `orders` stores checkout requests with customer details, purchased items, total, payment state, and timestamp.
- `sell_submissions` stores devices submitted by customers for review.
- `offers` stores promotional campaigns and discount details.

2. Security
- Row Level Security is enabled on every table.
- The public storefront can read available products and active offers.
- Customers can create orders and sell submissions without an account.
- Admin-only editing will use authenticated Supabase sessions in the dashboard.

3. Important Notes
- Prices are stored as numeric Egyptian pound amounts.
- Payment remains Pending until the isolated payment confirmation step updates it.
- Seed rows are genuine catalog content for the initial storefront and can be edited from the future admin area.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  console text NOT NULL,
  category text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('New', 'Used')),
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  description text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  governorate text NOT NULL,
  address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  payment_status text NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Failed', 'Pending')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sell_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  item_name text NOT NULL,
  console text NOT NULL,
  condition text NOT NULL,
  asking_price numeric(12,2),
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount_percent integer NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
  code text,
  active boolean NOT NULL DEFAULT true,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_available_products" ON products;
CREATE POLICY "public_read_available_products" ON products FOR SELECT TO anon, authenticated USING (status = 'available');
DROP POLICY IF EXISTS "public_create_orders" ON orders;
CREATE POLICY "public_create_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_create_sell_submissions" ON sell_submissions;
CREATE POLICY "public_create_sell_submissions" ON sell_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_read_active_offers" ON offers;
CREATE POLICY "public_read_active_offers" ON offers FOR SELECT TO anon, authenticated USING (active = true AND (ends_at IS NULL OR ends_at > now()));

INSERT INTO products (name, console, category, condition, price, description, images)
SELECT * FROM (VALUES
  ('PlayStation 5 Slim', 'PS5', 'Consoles', 'New', 28999.00, 'The slimmer PS5 with lightning-fast loading and immersive haptic feedback.', ARRAY['https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=1200']),
  ('DualSense Wireless Controller', 'PS5', 'Accessories', 'New', 4499.00, 'Precision control with adaptive triggers and haptic feedback.', ARRAY['https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=1200']),
  ('Gran Turismo 7', 'PS5', 'Games', 'Used', 1799.00, 'Experience the complete real driving simulator.', ARRAY['https://images.pexels.com/photos/7915356/pexels-photo-7915356.jpeg?auto=compress&cs=tinysrgb&w=1200']),
  ('PlayStation Classic Bundle', 'PS1', 'Retro', 'Used', 3299.00, 'A nostalgic collection of iconic gaming memories, ready to replay.', ARRAY['https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200'])
) AS seed(name, console, category, condition, price, description, images)
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO offers (title, description, discount_percent, code)
SELECT 'Level up your setup', 'Save on selected accessories this week.', 10, 'HUB10'
WHERE NOT EXISTS (SELECT 1 FROM offers);
