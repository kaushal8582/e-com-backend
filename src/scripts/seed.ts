import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const CATEGORIES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Pendants',
  'Anklets',
  'Brooches',
  'Bangles',
  'Chains',
  'Jewelry Sets',
];

const JEWELRY_IMAGES = [
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=987',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
  'https://images.unsplash.com/photo-1731586249471-82bb9b2f769a?&w=987',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600',
  'https://images.unsplash.com/photo-1716512064598-4536d086736c?&w=916',
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600',
  'https://images.unsplash.com/photo-1656428361267-b309fd9b20f5?&w=1365',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
  'https://images.unsplash.com/photo-1659095141570-be8b9aff59ce?&w=2070',
];

const MATERIALS = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold', 'Sterling Silver'];
const PURITY = ['18K', '22K', '24K', '925', '14K'];
const STONES = ['Diamond', 'Pearl', 'Ruby', 'Emerald', 'Sapphire', 'Opal', 'Amethyst', 'Topaz', 'None'];
const STYLE = ['Classic', 'Vintage', 'Contemporary', 'Minimalist', 'Statement', 'Traditional'];

const RING_NAMES = ['Solitaire Ring', 'Band Ring', 'Cocktail Ring', 'Eternity Ring', 'Cluster Ring', 'Halo Ring'];
const NECKLACE_NAMES = ['Pendant Necklace', 'Choker', 'Layered Necklace', 'Chain Necklace', 'Statement Necklace', 'Princess Necklace'];
const EARRING_NAMES = ['Stud Earrings', 'Hoop Earrings', 'Drop Earrings', 'Chandelier Earrings', 'Jacket Earrings', 'Threader Earrings'];
const BRACELET_NAMES = ['Tennis Bracelet', 'Bangle', 'Cuff Bracelet', 'Chain Bracelet', 'Charm Bracelet', 'Slave Bracelet'];
const PENDANT_NAMES = ['Locket', 'Cross Pendant', 'Heart Pendant', 'Initial Pendant', 'Gemstone Pendant', 'Medallion'];
const ANKLET_NAMES = ['Chain Anklet', 'Beaded Anklet', 'Charm Anklet', 'Slave Anklet', 'Crystal Anklet'];
const OTHER_NAMES = ['Brooch', 'Pin', 'Hair Pin', 'Bangle Set', 'Necklace Set', 'Earring Set'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNamesForCategory(category: string): string[] {
  switch (category) {
    case 'Rings':
      return RING_NAMES;
    case 'Necklaces':
      return NECKLACE_NAMES;
    case 'Earrings':
      return EARRING_NAMES;
    case 'Bracelets':
      return BRACELET_NAMES;
    case 'Pendants':
      return PENDANT_NAMES;
    case 'Anklets':
      return ANKLET_NAMES;
    default:
      return OTHER_NAMES;
  }
}

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to MongoDB');

  const adminEmail = 'admin@ecommerce.local';
  const adminPassword = 'Admin@123';

  await User.deleteMany({});
  await Product.deleteMany({});

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: 'Admin',
    email: adminEmail,
    passwordHash,
    role: 'ADMIN',
  });

  console.log('\n========================================');
  console.log('Admin user created:');
  console.log('  Email:', adminEmail);
  console.log('  Password:', adminPassword);
  console.log('========================================\n');

  const products: Array<Record<string, unknown>> = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < 200; i++) {
    const category = randomChoice(CATEGORIES);
    const names = getNamesForCategory(category);
    const baseName = randomChoice(names);
    const material = randomChoice(MATERIALS);
    const title = `${material} ${baseName} ${i + 1}`;
    let slug = slugify(title);
    while (usedSlugs.has(slug)) {
      slug = `${slug}-${i}`;
    }
    usedSlugs.add(slug);

    const price = randomInt(999, 49999);
    const hasDiscount = Math.random() > 0.5;
    const discountPrice = hasDiscount ? Math.round(price * (0.75 + Math.random() * 0.2)) : undefined;

    const stone = randomChoice(STONES);
    const style = randomChoice(STYLE);
    const purity = randomChoice(PURITY);
    const specs: Record<string, string> = {
      Material: material,
      Purity: purity,
      Stone: stone,
      Style: style,
    };
    if (randomInt(0, 1)) {
      specs['Weight'] = `${randomInt(1, 50)}g`;
    }

    const imageUrl = randomChoice(JEWELRY_IMAGES);
    products.push({
      title,
      slug,
      description: `Beautiful ${material.toLowerCase()} ${baseName.toLowerCase()} from our jewelry collection. Crafted with care, this ${style.toLowerCase()} piece features ${stone !== 'None' ? stone.toLowerCase() : 'elegant'} design. Perfect for occasions or everyday wear. Category: ${category}.`,
      price,
      discountPrice,
      category,
      stock: randomInt(1, 100),
      images: [{ url: imageUrl, publicId: `seed-jewelry-${i}-${Date.now()}` }],
      specs,
      isActive: true,
      isDeleted: false,
    });
  }

  await Product.insertMany(products);
  console.log(`Created ${products.length} jewelry products.`);

  await mongoose.disconnect();
  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
