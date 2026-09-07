import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalchairs');
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  const reviews = await db.collection('reviews').find({}).toArray();
  console.log('Found', products.length, 'products and', reviews.length, 'reviews.');

  for (const prod of products) {
    const matchingReviews = reviews.filter(r => 
      (r.product && r.product.toString() === prod._id.toString()) ||
      (r.productName && r.productName.trim().toLowerCase() === prod.name.trim().toLowerCase())
    );

    const approvedReviews = matchingReviews.filter(r => r.status !== 'rejected');
    const count = approvedReviews.length;
    const avg = count > 0 
      ? Number((approvedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / count).toFixed(1))
      : 5.0;

    await db.collection('products').updateOne(
      { _id: prod._id },
      { $set: { reviewCount: count, rating: avg } }
    );

    for (const r of matchingReviews) {
      await db.collection('reviews').updateOne(
        { _id: r._id },
        { $set: { product: prod._id, productName: prod.name } }
      );
    }
    console.log(`Synced "${prod.name}" => ${count} reviews, rating ${avg}`);
  }

  await mongoose.disconnect();
  console.log('Synchronization complete!');
}

run().catch(console.error);
