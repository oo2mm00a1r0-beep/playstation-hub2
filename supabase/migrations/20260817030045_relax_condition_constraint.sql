-- Allow rich condition values beyond just 'New'/'Used'
-- e.g. 'Used (Excellent)', 'Used (Like New)', 'New (Sealed)'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_condition_check;
ALTER TABLE products ADD CONSTRAINT products_condition_check CHECK (condition IN (
  'New',
  'New (Sealed)',
  'Used',
  'Used (Like New)',
  'Used (Excellent)',
  'Used (Good)',
  'Used (Fair)'
));
