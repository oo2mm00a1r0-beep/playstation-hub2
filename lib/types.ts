export type Product = {
  id: string;
  name: string;
  console: string;
  category: string;
  condition: 'New' | 'Used';
  price: number;
  description: string;
  images: string[];
  status: 'available' | 'sold';
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  governorate: string;
  address: string;
  items: CartItem[];
  total: number;
  payment_status: 'Paid' | 'Failed' | 'Pending';
  created_at: string;
};

export type SellSubmission = {
  id: string;
  customer_name: string;
  phone: string;
  item_name: string;
  console: string;
  condition: string;
  asking_price: number | null;
  notes: string;
  status: 'new' | 'reviewing' | 'closed';
  created_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  code: string | null;
  active: boolean;
  ends_at: string | null;
  created_at: string;
};

export const CONSOLES = ['PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita'] as const;
export const CATEGORIES = ['Consoles', 'Games', 'Accessories', 'Retro'] as const;

export const EGYPT_GOVERNORATES = [
  { name: 'Cairo', days: '1-2 days' },
  { name: 'Giza', days: '1-2 days' },
  { name: 'Alexandria', days: '2-3 days' },
  { name: 'Dakahlia', days: '2-3 days' },
  { name: 'Red Sea', days: '3-4 days' },
  { name: 'Beheira', days: '2-3 days' },
  { name: 'Faiyum', days: '2-3 days' },
  { name: 'Gharbia', days: '2-3 days' },
  { name: 'Ismailia', days: '2-3 days' },
  { name: 'Menofia', days: '2-3 days' },
  { name: 'Minya', days: '3-4 days' },
  { name: 'Qalyubia', days: '1-2 days' },
  { name: 'New Valley', days: '4-5 days' },
  { name: 'Suez', days: '2-3 days' },
  { name: 'Aswan', days: '3-4 days' },
  { name: 'Asyut', days: '3-4 days' },
  { name: 'Beni Suef', days: '2-3 days' },
  { name: 'Port Said', days: '2-3 days' },
  { name: 'Damietta', days: '2-3 days' },
  { name: 'Sharkia', days: '2-3 days' },
  { name: 'South Sinai', days: '3-4 days' },
  { name: 'Kafr El Sheikh', days: '2-3 days' },
  { name: 'Matrouh', days: '3-4 days' },
  { name: 'Luxor', days: '3-4 days' },
  { name: 'Qena', days: '3-4 days' },
  { name: 'North Sinai', days: '3-4 days' },
  { name: 'Sohag', days: '3-4 days' },
];
