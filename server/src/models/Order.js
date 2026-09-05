import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    color: {
      type: String,
      default: '#2E6B4D',
    },
    colorName: {
      type: String,
      default: 'Artisan Selected Finish',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `RC-${Date.now().toString().slice(-6)}`;
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: {
      name: { type: String, required: true, default: 'Valued Client' },
      email: { type: String, required: true, default: 'client@royalchairs.com' },
      phone: { type: String, default: '+91 98765 43210' },
      address: { type: String, default: 'Royal Villa, Mayfair Estate' },
      city: { type: String, default: 'London' },
      state: { type: String, default: 'Greater London' },
      pincode: { type: String, default: 'SW1A 1AA' },
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'online',
    },
    paymentStatus: {
      type: String,
      default: 'paid',
    },
    orderStatus: {
      type: String,
      default: 'confirmed',
    },
    trackingNumber: {
      type: String,
      default: function () {
        return `TRK-${Date.now().toString().slice(-8)}`;
      },
    },
    estimatedDelivery: {
      type: Date,
      default: function () {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
