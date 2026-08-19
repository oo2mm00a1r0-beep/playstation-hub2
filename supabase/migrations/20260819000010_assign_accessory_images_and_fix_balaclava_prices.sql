UPDATE products
SET images = ARRAY[
  '/images/products/ps5-keychain-01.jpg',
  '/images/products/ps5-keychain-02.jpg',
  '/images/products/ps5-keychain-03.jpg',
  '/images/products/ps5-keychain-04.jpg',
  '/images/products/ps5-keychain-05.jpg',
  '/images/products/ps5-keychain-06.jpg',
  '/images/products/ps5-keychain-07.jpg',
  '/images/products/ps5-keychain-08.jpg',
  '/images/products/ps5-keychain-09.jpg'
]
WHERE name = 'PS5 Controller Keychain';

UPDATE products
SET images = ARRAY[
  '/images/products/astro-headset-01.jpg',
  '/images/products/astro-headset-02.jpg',
  '/images/products/astro-headset-03.jpg',
  '/images/products/astro-headset-04.jpg',
  '/images/products/astro-headset-05.jpg',
  '/images/products/astro-headset-06.jpg'
]
WHERE name = 'Astro A20 Wireless Headset';

UPDATE products
SET images = ARRAY[
  '/images/products/ps1-memory-card-01.jpg',
  '/images/products/ps1-memory-card-02.jpg'
]
WHERE name = 'PS1 Memory Card (Original Sony)';

UPDATE products
SET images = ARRAY[
  '/images/products/xbox-red-01.jpg',
  '/images/products/xbox-red-02.jpg'
]
WHERE name = 'Xbox Series Controller — Pulse Red';

UPDATE products
SET images = ARRAY[
  '/images/products/xbox-white-01.jpg',
  '/images/products/xbox-white-02.jpg',
  '/images/products/xbox-white-03.jpg',
  '/images/products/xbox-white-04.jpg'
]
WHERE name = 'Xbox Series Controller — White';

UPDATE products
SET images = ARRAY[
  '/images/products/xbox-robot-white-01.jpg',
  '/images/products/xbox-robot-white-02.jpg',
  '/images/products/xbox-robot-white-03.jpg',
  '/images/products/xbox-robot-white-04.jpg',
  '/images/products/xbox-robot-white-05.jpg'
]
WHERE name = 'Xbox Series Controller — Robot White';

UPDATE products
SET images = ARRAY['/images/products/ps1-cony-controller.jpg']
WHERE name = 'PS1 Controller (CONY brand)';

UPDATE products
SET images = ARRAY['/images/products/ps-sakkara-ai-controller.jpg']
WHERE name = 'PS Sakkara AI Controller';

UPDATE products
SET price = 350
WHERE category = 'Clothing'
  AND name ILIKE '%Balaclava%'
  AND price = 250;