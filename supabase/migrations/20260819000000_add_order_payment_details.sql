ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS reference_number text;

UPDATE orders
SET payment_method = 'Naspay'
WHERE payment_method IS NULL;

ALTER TABLE orders
  ALTER COLUMN payment_method SET DEFAULT 'Naspay';
