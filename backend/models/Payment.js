// models/Payment.js - Payment tracking
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, required: true },
  orderId: String,
  amount: Number,
  method: { type: String, enum: ['card', 'upi', 'wallet', 'cod'], default: 'card' },
  isPartial: Boolean,
  partialAmount: Number,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionRef: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);
