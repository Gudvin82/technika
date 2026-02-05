export interface TechSpecs {
  cpu?: string;
  gpu?: string;
  ram?: number;
  ramType?: string;
  ssd?: number;
  screenSize?: number;
  refreshRate?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand: string;
  images: string[];
  specs: Record<string, string>;
  shortSpecs: string[];
  techSpecs: TechSpecs;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badges: ('hit' | 'sale' | 'new' | 'fastDelivery')[];
  description: string;
  warranty: string;
  deliveryDate: string;
  features: string[];
  included: string[];
  compatible: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode: string;
  loyaltyLevel: 'bronze' | 'silver' | 'gold';
  bonusPoints: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  deliveryAddress?: string;
  trackingNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type Theme = 'light' | 'neon';
export type Language = 'ru' | 'en';

export interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  workHours: string;
  hasStock: boolean;
  metro?: string;
}

export interface FilterState {
  category: string | null;
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  cpu: string[];
  gpu: string[];
  ram: number[];
  ramType: string[];
  ssd: number[];
  screenSize: number[];
  refreshRate: number[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  productId?: string;
}
