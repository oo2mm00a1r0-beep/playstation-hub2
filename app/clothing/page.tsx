import { Catalog } from '@/components/catalog';

export default function ClothingPage() {
  return (
    <Catalog
      category="Clothing"
      title="Clothing"
      subtitle="PlayStation Hub apparel and gaming-inspired wear"
      emptyMessage="No products yet — check back soon!"
      emptyHint="New clothing items will appear here when they are available."
    />
  );
}