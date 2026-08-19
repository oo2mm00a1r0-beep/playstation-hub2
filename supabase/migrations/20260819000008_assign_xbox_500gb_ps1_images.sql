UPDATE products
SET images = ARRAY[
  '/images/products/xbox-one-s-500gb-01.jpg',
  '/images/products/xbox-one-s-500gb-02.jpg',
  '/images/products/xbox-one-s-500gb-03.jpg'
]
WHERE name = 'Xbox One S 500GB';

UPDATE products
SET images = ARRAY[
  '/images/products/ps1-bundle-01.jpg',
  '/images/products/ps1-bundle-02.jpg'
]
WHERE name = 'PS1 Complete Bundle';