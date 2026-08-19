import type { Product } from '@/lib/types';

export type ProductSpec = {
  label: string;
  value: string;
};

export function getConditionLabel(product: Product) {
  const condition = product.condition?.trim();
  if (condition) return condition;
  if (product.category === 'Clothing' || product.category === 'Accessories') return 'New';
  return 'Used';
}

function getStorage(product: Product) {
  const match = `${product.name} ${product.description}`.match(/\b\d+(?:GB|TB)\b/i);
  return match?.[0]?.toUpperCase() || 'Not specified';
}

function getControllerCount(product: Product) {
  const text = `${product.name} ${product.description}`.toLowerCase();
  if (/\b(two|2)\b[^.\n]*(controller|gamepad)/.test(text)) return '2';
  if (/\b(one|1)\b[^.\n]*(controller|gamepad)/.test(text) || text.includes('controller included')) return '1';
  return 'Not specified';
}

function getIncluded(product: Product) {
  const text = product.description || '';
  const included = text.match(/(?:includes?|comes with|with)\s+([^.!\n]+)/i)?.[1];
  return included ? included.trim() : 'Not specified';
}

export function getConsoleSpecs(product: Product): ProductSpec[] {
  const condition = getConditionLabel(product);
  return [
    { label: 'Condition', value: condition },
    { label: 'Storage', value: getStorage(product) },
    { label: 'Number of Controllers', value: getControllerCount(product) },
    { label: "What's Included", value: getIncluded(product) },
    {
      label: 'Warranty / Testing',
      value: condition.toLowerCase().includes('sealed')
        ? 'Sealed; testing details not specified'
        : 'Testing or warranty details not specified',
    },
  ];
}

function getGenre(product: Product) {
  const text = `${product.name} ${product.description}`.toLowerCase();
  if (/football|fifa|pes|soccer|wwe|tekken|mortal kombat|dragon ball/.test(text)) return 'Sports / Fighting';
  if (/racing|gran turismo|need for speed|kart/.test(text)) return 'Racing';
  if (/horror|resident evil|silent hill|nightmares/.test(text)) return 'Horror';
  if (/rpg|fantasy|horizon|final fantasy|dragon age|nioh|sekiro/.test(text)) return 'Action RPG';
  if (/shooter|battlefield|call of duty|far cry|killzone/.test(text)) return 'Action Shooter';
  if (/platformer|rayman|ratchet|tearaway|knack/.test(text)) return 'Platformer';
  return 'Not specified';
}

export function getGameSpecs(product: Product): ProductSpec[] {
  return [
    { label: 'Genre', value: getGenre(product) },
    { label: 'Platform', value: product.console || 'Not specified' },
    { label: 'Gameplay', value: product.description || 'Gameplay description not specified' },
  ];
}