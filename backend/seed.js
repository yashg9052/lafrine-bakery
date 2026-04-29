// seed.js - Initialize database with sample data
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import SaleItem from './models/SaleItem.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/la-farine';

// 12 Menu Items (3 bread, 3 pastry, 3 cake, 3 drink)
const MENU_DATA = [
  // ── BREADS ──
  {
    name: 'Sourdough Loaf',
    cat: 'bread',
    price: 280,
    tag: '',
    desc: 'Long-fermented, crispy crust, chewy crumb. A daily staple.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
  },
  {
    name: 'Multigrain Boule',
    cat: 'bread',
    price: 260,
    tag: '',
    desc: 'Seven grains, nutty flavour, dense & satisfying.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  },
  {
    name: 'Garlic Focaccia',
    cat: 'bread',
    price: 220,
    tag: 'new',
    desc: 'Sea salt, rosemary, roasted garlic. Italian perfection.',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&q=80',
  },
  // ── PASTRIES ──
  {
    name: 'Butter Croissant',
    cat: 'pastry',
    price: 120,
    tag: '',
    desc: '72-hour lamination. Shatters on first bite.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  },
  {
    name: 'Almond Tart',
    cat: 'pastry',
    price: 180,
    tag: '',
    desc: 'Frangipane filling, toasted almonds, crisp shell.',
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=80',
  },
  {
    name: 'Pain au Chocolat',
    cat: 'pastry',
    price: 150,
    tag: 'new',
    desc: 'Dark chocolate batons wrapped in buttery pastry.',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80',
  },
  // ── CAKES ──
  {
    name: 'Carrot Cake',
    cat: 'cake',
    price: 480,
    tag: '',
    desc: 'Three layers, cream cheese frosting, candied walnuts.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80',
  },
  {
    name: 'Lemon Drizzle',
    cat: 'cake',
    price: 420,
    tag: '',
    desc: 'Zingy & moist, topped with lemon curd and citrus icing.',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80',
  },
  {
    name: 'Opera Cake',
    cat: 'cake',
    price: 560,
    tag: 'new',
    desc: 'Coffee buttercream, ganache, almond joconde layers.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
  // ── DRINKS ──
  {
    name: 'Cafe Latte',
    cat: 'drink',
    price: 140,
    tag: '',
    desc: 'Double shot espresso, steamed whole milk, light foam.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
  },
  {
    name: 'Fresh Orange Juice',
    cat: 'drink',
    price: 120,
    tag: '',
    desc: 'Cold-pressed, pulpy, pure Valencia orange juice.',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80',
  },
  {
    name: 'Hot Chocolate',
    cat: 'drink',
    price: 160,
    tag: 'new',
    desc: 'Rich Belgian cocoa, steamed milk, whipped cream & marshmallows.',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80',
  },
];

// 3 Sale Items (cancelled orders at discounted prices)
const SALE_DATA = [
  {
    name: 'Opera Cake (Whole)',
    originalPrice: 560,
    salePrice: 280,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    quantity: 1,
    reason: 'Cancelled order - Flash sale!',
  },
  {
    name: 'Sourdough Loaf',
    originalPrice: 280,
    salePrice: 140,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
    expiresAt: new Date(Date.now() + 5400000), // 1.5 hours from now
    quantity: 2,
    reason: 'Cancelled order - Flash sale!',
  },
  {
    name: 'Butter Croissant Box (6 pcs)',
    originalPrice: 720,
    salePrice: 360,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    expiresAt: new Date(Date.now() + 7200000), // 2 hours from now
    quantity: 1,
    reason: 'Cancelled bulk order - 50% off!',
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await SaleItem.deleteMany({});
    console.log('✓ Cleared existing collections');

    // Insert menu items
    await MenuItem.insertMany(MENU_DATA);
    console.log(`✓ Inserted ${MENU_DATA.length} menu items`);

    // Insert sale items
    await SaleItem.insertMany(SALE_DATA);
    console.log(`✓ Inserted ${SALE_DATA.length} sale items`);

    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
