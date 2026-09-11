import 'dotenv/config';
import connectDB from '../config/db.js';
import Banner from '../models/Banner.js';

const SEED_BANNERS = [
  // Hero Banners
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
    order: 0,
    type: 'hero',
  },
  {
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
    order: 1,
    type: 'hero',
  },

  // New Collection Banners
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 0,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 1,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 2,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 3,
    type: 'new_collection',
  },

  // Spotlight Banner & Copy
  {
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=85',
    link: '#category-gaming',
    categorySlug: 'gaming',
    title: 'The Sovereign Orthopedic Executive Leather Throne',
    subtitle: 'Master-Crafted Ergonomics & Unmatched Spinal Comfort',
    description:
      'Smart, adaptable design engineered for high-focus professionals and esports champions. Seamlessly elevates your space with dual-density cold-cured foam, 4D adaptive lumbar alignment, and premium breathable leatherette.',
    buttonText: 'SHOP NOW',
    active: true,
    order: 0,
    type: 'spotlight',
  },

  // Craftsmanship Story Banner
  {
    badge: 'THE MATERIALS & CRAFT',
    title: 'From FSC English Oak Forests to Hand-Stitched Italian Nappa Leather',
    description:
      'Unlike mass-market plastic chairs that break easily, every RoyalChairs model features an internal heavy-duty steel backbone encased in high-density molded memory foam.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Master Craftsman Workshop • Gloucestershire, UK',
    link: '#craftsmanship',
    active: true,
    order: 0,
    type: 'craft',
  },
];

export const seedBanners = async () => {
  try {
    for (const item of SEED_BANNERS) {
      const exists = await Banner.findOne({ type: item.type, order: item.order });
      if (!exists) {
        await Banner.create(item);
        console.log(`[Banner Seed] Added banner: ${item.type} [${item.order}]`);
      }
    }
  } catch (err) {
    console.error('[Banner Seed] Failed:', err.message);
  }
};

const runStandalone = async () => {
  if (process.argv[1]?.includes('seedBanners.js')) {
    await connectDB();
    await seedBanners();
    console.log('[Banner Seed] Done.');
    process.exit(0);
  }
};

runStandalone();
