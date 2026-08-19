UPDATE products
SET images = ARRAY[
  '/images/products/xbox-one-s-01.jpg',
  '/images/products/xbox-one-s-02.jpg',
  '/images/products/xbox-one-s-03.jpg',
  '/images/products/xbox-one-s-04.jpg',
  '/images/products/xbox-one-s-05.jpg'
]
WHERE name = 'Xbox One S 1TB';

UPDATE products
SET images = ARRAY['/images/products/ps3-320gb.jpg']
WHERE name = 'PS3 Slim 500GB (Imported, Modded)';