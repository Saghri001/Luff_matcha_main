import { ProductItem, StoreScheduleDay, FeatureHighlight } from '../types';

export const HERO_CARDS_DATA = [
  {
    id: 'latte',
    title: 'Strawberry Iced Matcha',
    subtitle: 'Organic strawberry puree, oat milk, Kyoto ceremonial float',
    tag: 'Signature Drink',
    badge: 'Café Favorite',
    color: '#DDF0FF',
    accentColor: '#EF233C',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
    stat1: { label: 'Origins', value: 'Uji, Kyoto' },
    stat2: { label: 'L-Theanine', value: '45mg Calm' },
  },
  {
    id: 'whisk',
    title: 'Ceremonial Whisking',
    subtitle: 'Micro-milled stone ground tencha whisked to velvety jade micro-foam',
    tag: 'Traditional Ritual',
    badge: '100% Ceremonial',
    color: '#F0FDF4',
    accentColor: '#58A331',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    stat1: { label: 'Harvest', value: 'First Flush (Spring)' },
    stat2: { label: 'Granularity', value: '5-10 Microns' },
  },
  {
    id: 'tin',
    title: 'LUFF Signature Tin (30g)',
    subtitle: 'Air-tight UV coated ice-blue tin preserving peak vibrant chlorophyll',
    tag: 'Retail Master Edition',
    badge: 'Limited Batch',
    color: '#E0F2FE',
    accentColor: '#EF233C',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1000&q=80',
    stat1: { label: 'Net Weight', value: '30g (~15 Servings)' },
    stat2: { label: 'Shade Time', value: '28 Days Covered' },
  },
];

export const HIGHLIGHT_FEATURES: FeatureHighlight[] = [
  {
    id: 'origin',
    number: '01',
    title: 'Uji Single-Origin',
    subtitle: 'Kyoto Terroir & Shade Growth',
    description: 'Harvested exclusively from fifth-generation family estates in Uji, Kyoto. Covered under straw reed tarps for 28 continuous days to supercharge chlorophyll and naturally sweet amino acids.',
    iconName: 'Mountain',
    tag: '100% Organic Tencha',
    stats: { label: 'Harvest Season', value: 'Spring First Flush' },
    details: [
      'Volcanic mineral-rich river valley soil',
      'Hand-plucked tender top young buds',
      'Traditional granite wheel stone-milling',
    ],
  },
  {
    id: 'flavor',
    number: '02',
    title: 'Vibrant Umami Profile',
    subtitle: 'Zero Bitterness Guarantee',
    description: 'Electric bright jade emerald color with an intensely creamy, buttery texture. Delivers sweet oceanic notes and savory umami notes without any harsh astringency.',
    iconName: 'Leaf',
    tag: 'Ceremonial Grade AAA',
    stats: { label: 'Color Index', value: 'Vivid Jade #74C649' },
    details: [
      'Velvety smooth mouthfeel without sugar',
      'Natural sweetness from high theanine',
      'No chalky residue or bitter aftertaste',
    ],
  },
  {
    id: 'energy',
    number: '03',
    title: 'Clean Sustained Energy',
    subtitle: 'Alpha-Wave Creative Focus',
    description: 'Combines 70mg of clean caffeine bound to pure L-Theanine. Experience 4 to 6 hours of crystal-clear cognitive flow without jittery caffeine spikes, heart races, or afternoon crashes.',
    iconName: 'Zap',
    tag: 'Clean Nootropic',
    stats: { label: 'Sustained Duration', value: '6 Hours Steady' },
    details: [
      'Promotes relaxed alert alpha brainwaves',
      'High antioxidant EGCG density',
      'Calms cortisol levels while enhancing focus',
    ],
  },
];

export const SINGLE_PRODUCT: ProductItem = {
  id: 'luff-ceremonial-tin-30g',
  name: 'LUFF Ceremonial Matcha (30g)',
  category: 'tins',
  price: 34.00,
  description: 'First-harvest single-origin Uji tencha stone-milled to 5 microns. Electric jade color, velvety umami, and pure alpha-wave focus with zero bitterness.',
  longDescription: 'Our only product, perfected. Grown exclusively in Uji, Kyoto and shaded under natural straw reed tarps for 28 continuous days. Hand-harvested during the first spring flush and stone-ground by granite mills at 35g/hour to protect delicate amino acids and vibrant chlorophyll.',
  badge: 'Flagship Tin',
  image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=800&q=80',
  tags: ['First Harvest', 'Kyoto Direct', 'Ceremonial Grade AAA', 'Zero Bitterness'],
  volumeOrWeight: '30g (~15 to 20 servings)',
  flavorNotes: ['Sweet Cream', 'Pistachio', 'Electric Green Umami', 'Subtle Chestnut'],
  caffeineMg: 68,
  lTheanineMg: 48,
  origin: 'Uji, Kyoto, Japan (Single Estate)',
  isPopular: true,
};

export const PRODUCTS_LIST: ProductItem[] = [
  SINGLE_PRODUCT,
];

export const STORE_SCHEDULE: StoreScheduleDay[] = [
  { day: 'Monday', open: '07:30 AM', close: '07:00 PM' },
  { day: 'Tuesday', open: '07:30 AM', close: '07:00 PM' },
  { day: 'Wednesday', open: '07:30 AM', close: '07:00 PM' },
  { day: 'Thursday', open: '07:30 AM', close: '07:00 PM' },
  { day: 'Friday', open: '07:30 AM', close: '09:00 PM' },
  { day: 'Saturday', open: '08:00 AM', close: '09:00 PM' },
  { day: 'Sunday', open: '08:30 AM', close: '06:00 PM' },
];

export const STORE_INFO = {
  name: 'LUFF Flagship Café & Listening Bar',
  address: '412 Creative Boulevard, Arts District',
  cityStateZip: 'New York, NY 10013',
  crossStreets: 'Between Grand & Broome St',
  phone: '+1 (212) 555-LUFF',
  email: 'hello@luffmatcha.com',
  features: [
    { icon: 'Disc3', title: 'Analog Vinyl Bar', desc: 'Curated ambient Japanese city-pop & jazz records playing all day.' },
    { icon: 'Wifi', title: 'Fast Studio Wi-Fi', desc: 'Dedicated charging desks designed for laptops, sketchbooks & deep work.' },
    { icon: 'Milk', title: 'Organic Barista Mylks', desc: 'Custom oat, pistachio, and fresh macadamia nut milks made in-house.' },
    { icon: 'Heart', title: 'Puppy Friendly', desc: 'Outdoor garden seating with complimentary oat foam puppuccinos.' },
  ],
};

export const REVIEWS = [
  {
    author: 'Elena R.',
    role: 'Product Designer at Figma',
    quote: 'Replaced my 3-cup espresso habit with LUFF. The sustained focus without the crash changed my afternoons completely.',
    rating: 5,
    drink: 'Strawberry Iced Matcha',
  },
  {
    author: 'Marcus K.',
    role: 'Creative Director',
    quote: 'The vibrant emerald green color is unreal. Most matcha in the states tastes like bitter lawn clipping—LUFF is velvety, rich, and sweet.',
    rating: 5,
    drink: 'LUFF Ceremonial Tin (30g)',
  },
  {
    author: 'Aria Chen',
    role: 'Architect & Typographer',
    quote: 'The space on Creative Blvd is my second office. Incredible aesthetic, great sound system, and the Matcha Tonic is genius.',
    rating: 5,
    drink: 'Matcha Espresso Tonic',
  },
];
