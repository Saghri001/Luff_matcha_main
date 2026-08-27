export type ProductCategory = 'cafe' | 'tins' | 'gear';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
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

export interface StoreScheduleDay {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface FeatureHighlight {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  tag: string;
  stats: { label: string; value: string };
  details: string[];
}
