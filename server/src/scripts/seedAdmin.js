import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

export const seedDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@royalchairs.com';
    
    // 1. Seed in Admin collection
    const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() }).select('+password');
    if (!existingAdmin) {
      await Admin.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password: 'admin@2026',
        role: 'superadmin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      console.log(`[Admin Seed] Created default admin in Admin collection: ${adminEmail}`);
    } else {
      const isMatch = await existingAdmin.matchPassword('admin@2026');
      if (!isMatch) {
        existingAdmin.password = 'admin@2026';
        await existingAdmin.save();
        console.log(`[Admin Seed] Updated password in Admin collection: ${adminEmail}`);
      }
    }

    // 2. Seed in User collection as admin role (for fallback compatibility)
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');
    if (!existingUser) {
      await User.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password: 'admin@2026',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      console.log(`[Admin Seed] Created default admin in User collection: ${adminEmail}`);
    } else {
      const isMatch = await existingUser.matchPassword('admin@2026');
      if (!isMatch || existingUser.role !== 'admin') {
        existingUser.password = 'admin@2026';
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`[Admin Seed] Updated password/role in User collection: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.error('[Admin Seed] Error seeding default admin:', error.message);
  }
};

// Standalone execution support: node src/scripts/seedAdmin.js
const runStandalone = async () => {
  if (process.argv[1]?.includes('seedAdmin.js')) {
    try {
      await connectDB();
      await seedDefaultAdmin();
      console.log('[Admin Seed] Done.');
      process.exit(0);
    } catch (err) {
      console.error('[Admin Seed] Failed:', err);
      process.exit(1);
    }
  }
};

runStandalone();
