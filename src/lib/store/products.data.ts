import { ProductItem, PromoCode, ShippingOption } from './types';
import mushroomMatchaImg from '../../assets/products/mushroom_matcha.jpeg';
import mushroomCoffeeImg from '../../assets/products/mushroom_coffee.jpeg';
import heroIcedMatchaImg from '../../assets/images/luff_iced_matcha_hero_1787223577925.jpg';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'luff-mushroom-matcha-30g',
    name: 'LUFF Organic Mushroom Matcha (30g)',
    category: 'tins',
    price: 28.00,
    stockCount: 45,
    description: '100% Single-estate Kyoto ceremonial matcha infused with 1,500mg dual-extracted Lion’s Mane & Reishi mushrooms.',
    longDescription: 'Harvested exclusively from Uji, Kyoto family estates covered under straw reed tarps for 28 continuous days. Stone-milled to 5 microns and blended with organic fruiting body Lion’s Mane & Reishi for calm, jitter-free cognitive flow.',
    badge: 'Best Seller',
    image: mushroomMatchaImg,
    tags: ['Focus & Calm', 'Uji First Flush', '1,500mg Dual-Extract', 'Zero Sugar'],
    volumeOrWeight: '30g (~15 Servings)',
    flavorNotes: ['Velvety Umami', 'Pistachio', 'Nutty Cocoa'],
    caffeineMg: 45,
    lTheanineMg: 60,
    origin: 'Uji, Kyoto, Japan (Single Estate)',
    isPopular: true,
  },
  {
    id: 'luff-mushroom-coffee-250g',
    name: 'LUFF Organic Mushroom Coffee (250g)',
    category: 'coffee',
    price: 24.00,
    stockCount: 30,
    description: 'Single-origin Guatemalan dark roast Arabica coffee infused with wild-harvested Chaga & Cordyceps mushrooms.',
    longDescription: 'Artisanal micro-roasted Guatemalan Arabica beans combined with 1,500mg dual-extracted Chaga & Cordyceps. Delivers clean physical stamina, digestive comfort, and half the caffeine of standard drip coffee.',
    badge: 'Clean Energy',
    image: mushroomCoffeeImg,
    tags: ['Clean Stamina', 'Guatemala Arabica', 'Chaga & Cordyceps', 'Low Acid'],
    volumeOrWeight: '250g Whole Bean / Milled',
    flavorNotes: ['Dark Chocolate', 'Toasted Almond', 'Wild Honey'],
    caffeineMg: 50,
    lTheanineMg: 30,
    origin: 'Huehuetenango, Guatemala & Finland',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'luff-daily-ritual-bundle',
    name: 'LUFF Daily Ritual Bundle',
    category: 'tins',
    price: 46.00,
    salePrice: 46.00,
    isOnSale: true,
    stockCount: 20,
    description: 'The ultimate daily flow kit: 1x Organic Mushroom Matcha (30g) + 1x Organic Mushroom Coffee (250g) + Free Solid Brass Measuring Scoop.',
    longDescription: 'Combine morning stamina with afternoon calm. Includes our full-size 30g Ceremonial Mushroom Matcha tin, 250g Mushroom Coffee bag, and a custom gold brass measuring scoop ($15 value). Save 15% when purchased together.',
    badge: 'Save 15%',
    image: heroIcedMatchaImg,
    tags: ['Complete Flow Kit', 'Includes Free Brass Scoop', 'Save 15%', 'Free Shipping'],
    volumeOrWeight: 'Full Kit + Free Brass Scoop',
    flavorNotes: ['Matcha + Coffee Flow'],
    caffeineMg: 50,
    lTheanineMg: 60,
    origin: 'Uji, Kyoto & Guatemala',
    isPopular: true,
  },
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { id: '1', code: 'LUFF15', discountPercent: 15, minOrder: 0, active: true },
  { id: '2', code: 'FLOW20', discountPercent: 20, minOrder: 40, active: true },
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Standard DTC Ground (3-5 Days)', description: 'Carbon-neutral eco delivery', price: 4.99, minOrderForFree: 40 },
  { id: 'express', name: 'Express Priority (1-2 Days)', description: 'Temperature-controlled delivery', price: 8.99 },
];
