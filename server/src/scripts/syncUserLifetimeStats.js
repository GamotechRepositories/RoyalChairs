import User from '../models/User.js';
import Order from '../models/Order.js';

/**
 * Synchronizes lifetimeOrders and totalSpent for all existing users from historical orders in MongoDB.
 * Non-cancelled orders increment +1 and +totalAmount.
 * Cancelled orders do not count towards lifetime orders or total spent.
 */
export const syncUserLifetimeStats = async () => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      console.log('[RoyalChairs API] No users found to synchronize lifetime stats.');
      return;
    }

    let updatedCount = 0;

    for (const user of users) {
      const emailRegex = new RegExp(`^${user.email.trim()}$`, 'i');

      // Link any unlinked orders with matching email
      await Order.updateMany(
        { 'customer.email': emailRegex, user: null },
        { $set: { user: user._id } }
      );

      // Fetch all non-cancelled orders for this user
      const activeOrders = await Order.find({
        $or: [{ user: user._id }, { 'customer.email': emailRegex }],
        orderStatus: { $ne: 'cancelled' },
      });

      const calculatedLifetimeOrders = activeOrders.length;
      const calculatedTotalSpent = activeOrders.reduce((sum, o) => {
        const amt = Number(o.totalAmount) || 0;
        return sum + amt;
      }, 0);

      await User.findByIdAndUpdate(user._id, {
        $set: {
          lifetimeOrders: calculatedLifetimeOrders,
          totalSpent: calculatedTotalSpent,
        },
      });

      updatedCount++;
    }

    console.log(
      `[RoyalChairs API] Successfully synced lifetime orders & total spent for ${updatedCount} users from MongoDB orders history.`
    );
  } catch (error) {
    console.error('[RoyalChairs API] Error syncing user lifetime stats:', error.message);
  }
};
