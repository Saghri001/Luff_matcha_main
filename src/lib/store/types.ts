import React from 'react';

export type ProductCategory = 'tins' | 'adaptogens' | 'coffee' | 'gear' | 'drinks';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  isOnSale?: boolean;
  stockCount: number;
  description: string;
  longDescription?: string;
  badge?: string;
  image: string;
  tags: string[];
  volumeOrWeight?: string;
  flavorNotes: string[];
  caffeineMg?: number;
  lTheanineMg?: number;
  origin?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedMilk?: string;
  selectedSweetness?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  promoCodeApplied?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  minOrder?: number;
  active: boolean;
  expiryDate?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  minOrderForFree?: number;
}

export type ActiveView = 
  | 'landing' 
  | 'store' 
  | 'admin' 
  | 'faq' 
  | 'contact' 
  | 'privacy' 
  | 'cookie' 
  | 'terms' 
  | 'shipping' 
  | 'returns';

export type LegalPolicyType = 'privacy' | 'cookie' | 'terms' | 'shipping' | 'returns';
