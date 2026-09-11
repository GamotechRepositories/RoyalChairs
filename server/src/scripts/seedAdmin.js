import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

export const seedDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@royalchairs.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() }).select('+password');

    if (!existingAdmin) {
      const newAdmin = await Admin.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password: 'admin@2026', // Bcrypt hook in Admin model will securely hash this password
        role: 'superadmin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });

      console.log(`[Admin Seed] Created default admin user: ${newAdmin.email} with bcrypt-hashed password.`);
      return newAdmin;
    } else {

      // Ensure password is reset to admin@2026 if it was altered or needs sync
      const isMatch = await existingAdmin.matchPassword('admin@2026');
      if (!isMatch) {
        existingAdmin.password = 'admin@2026';
        await existingAdmin.save();
        console.log(`[Admin Seed] Updated password for default admin: ${existingAdmin.email}`);
      }
      return existingAdmin;
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
