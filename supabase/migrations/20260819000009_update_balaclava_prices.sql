UPDATE products
SET price = 350
WHERE category = 'Clothing'
  AND name ILIKE '%Balaclava%'
  AND price = 250;