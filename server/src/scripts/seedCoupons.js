import 'dotenv/config';
import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import connectDB from '../config/db.js';

export const INITIAL_COUPONS = [
  {
    code: 'ROYAL50',
    type: 'percentage',
    value: 50,
    minSpend: 500,
    maxDiscount: 5000,
    usageCount: 84,
    limit: 200,
    active: true,
    expiry: '2026-12-31',
    description: '50% Off Executive Selection (Capped at ₹5,000, min spend ₹500)',
  },
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    maxDiscount: 1500,
    usageCount: 312,
    limit: 1000,
    active: true,
    expiry: '2026-12-31',
    description: '10% Welcome Discount (Capped at ₹1,500, min spend ₹100)',
  },
  {
    code: 'LUXURY20',
    type: 'percentage',
    value: 20,
    minSpend: 800,
    maxDiscount: 4000,
    usageCount: 65,
    limit: 150,
    active: true,
    expiry: '2026-09-30',
    description: '20% Luxury Lounge Promotion (Capped at ₹4,000, min spend ₹800)',
  },
  {
    code: 'ROYAL20',
    type: 'percentage',
    value: 20,
    minSpend: 1000,
    maxDiscount: 5000,
    usageCount: 42,
    limit: 200,
    active: true,
    expiry: '2026-12-31',
    description: 'Exclusive 20% privilege discount for premium clientele',
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 45,
    minSpend: 300,
    maxDiscount: null,
    usageCount: 140,
    limit: 500,
    active: true,
    expiry: '2026-10-15',
    description: 'Flat ₹45 / $45 Shipping Voucher (min spend ₹300)',
  },
];

export const seedDefaultCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(INITIAL_COUPONS);
      console.log(`[Coupon Seed] Seeded ${INITIAL_COUPONS.length} initial promotional coupons.`);
    } else {
      for (const item of INITIAL_COUPONS) {
        const exists = await Coupon.findOne({ code: item.code });
        if (!exists) {
          await Coupon.create(item);
          console.log(`[Coupon Seed] Added missing coupon: ${item.code}`);
        }
      }
    }
  } catch (error) {
    console.error('[Coupon Seed] Error seeding coupons:', error.message);
  }
};

const runStandalone = async () => {
  if (process.argv[1]?.includes('seedCoupons.js')) {
    try {
      await connectDB();
      await seedDefaultCoupons();
      console.log('[Coupon Seed] Done.');
      process.exit(0);
    } catch (err) {
      console.error('[Coupon Seed] Failed:', err);
      process.exit(1);
    }
  }
};

runStandalone();
