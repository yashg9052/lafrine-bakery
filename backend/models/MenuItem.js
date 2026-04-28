// models/MenuItem.js - Menu item schema
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cat: { type: String, enum: ['bread', 'pastry', 'cake', 'drink'], required: true },
  price: { type: Number, required: true },
  tag: { type: String, default: '' }, // 'new', '', etc.
  desc: String,
  image: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('MenuItem', menuItemSchema);
