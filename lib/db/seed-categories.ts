/**
 * Category Seed Script
 *
 * Seeds the database with initial product categories from DESIGN.md Section 2.2.
 * Each category includes gradient colors, icon identifiers, and sort order.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' lib/db/seed-categories.ts
 *
 *   Or add to package.json scripts:
 *   "seed:categories": "ts-node lib/db/seed-categories.ts"
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ─── Category Seed Data (from DESIGN.md Section 2.2) ───────────────────────

const categories = [
  {
    name: 'Tech & Gadgets',
    slug: 'tech-gadgets',
    description:
      'Discover the latest in technology, electronics, and innovative gadgets through live demonstrations and reviews.',
    gradient: {
      from: '#2563EB',
      via: '#06B6D4',
      to: '#10B981',
    },
    iconSet: ['game-controller', 'drone', 'smartphone', 'laptop', 'headphones'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description:
      'Explore beauty products, skincare routines, and personal care essentials with live tutorials and demos.',
    gradient: {
      from: '#FF6B9D',
      to: '#C71585',
    },
    iconSet: ['perfume-bottle', 'hair-dryer', 'lipstick', 'mirror', 'skincare'],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description:
      'Find health supplements, wellness products, and holistic lifestyle essentials through interactive live sessions.',
    gradient: {
      from: '#20D5C5',
      to: '#34D399',
    },
    iconSet: ['supplement-bottle', 'yoga', 'meditation', 'leaf', 'heart-pulse'],
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description:
      'Shop for athletic gear, fitness equipment, and sportswear with live product showcases and expert advice.',
    gradient: {
      from: '#FF6B3D',
      to: '#FF4B2B',
    },
    iconSet: ['tennis-racket', 'lightning-bolt', 'dumbbell', 'running-shoe', 'basketball'],
    isFeatured: true,
    sortOrder: 4,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description:
      'Discover the latest fashion trends, clothing, and accessories through live styling sessions and try-on hauls.',
    gradient: {
      from: '#8B5CF6',
      to: '#3B82F6',
    },
    iconSet: ['dress', 'handbag', 'sunglasses', 'shoe', 'jewelry'],
    isFeatured: true,
    sortOrder: 5,
  },
];

// ─── Seed Function ──────────────────────────────────────────────────────────

async function seedCategories() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Dynamically import the Category model after connection is established
    const { default: Category } = await import('../../models/Category');

    // Upsert each category (update if exists, create if not)
    for (const categoryData of categories) {
      const result = await Category.findOneAndUpdate(
        { slug: categoryData.slug },
        { $set: categoryData },
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
      console.log(`  ✅ ${result.name} (${result.slug})`);
    }

    console.log(`\n🎉 Successfully seeded ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// ─── Run ────────────────────────────────────────────────────────────────────

seedCategories();
