// models/SaleItem.js - Last minute sale items (cancelled orders)
import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: Number,
  salePrice: { type: Number, required: true },
  image: String,
  expiresAt: Date, // Sale expires at this timestamp
  quantity: { type: Number, default: 1 },
  reason: { type: String, default: 'Cancelled order - Flash sale!' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SaleItem', saleItemSchema);
