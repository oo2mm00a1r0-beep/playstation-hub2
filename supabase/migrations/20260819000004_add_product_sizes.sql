ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sizes text[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_sizes_check'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_sizes_check
      CHECK (
        sizes IS NULL
        OR sizes <@ ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[]
      );
  END IF;
END $$;
