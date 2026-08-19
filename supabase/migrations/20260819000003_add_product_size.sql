ALTER TABLE products
  ADD COLUMN IF NOT EXISTS size text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_size_check'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_size_check
      CHECK (size IS NULL OR size IN ('S', 'M', 'L', 'XL', 'XXL'));
  END IF;
END $$;