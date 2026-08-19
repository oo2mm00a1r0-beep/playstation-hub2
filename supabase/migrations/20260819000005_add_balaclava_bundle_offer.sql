INSERT INTO offers (title, description, discount_percent, code, active)
SELECT
  'Balaclava Bundle - Buy 3 for 750',
  'Buy any 3 balaclavas from the Clothing category together for 750 EGP total instead of 1050 EGP. Save 300 EGP.',
  29,
  NULL,
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM offers
  WHERE title = 'Balaclava Bundle - Buy 3 for 750'
);