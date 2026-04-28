// models/Order.js - Order schema
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  customer: {
    name: String,
    phone: String,
    email: String,
  },
  items: [
    {
      itemId: String,
      name: String,
      price: Number,
    },
  ],
  orderType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  pickupTime: String,
  notes: String,
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'], default: 'pending' },
  payment: {
    method: String,
    paidAmount: Number,
    remainingAmount: Number,
    status: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
