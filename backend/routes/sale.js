// routes/sale.js - Last Minute Sale API endpoints
import express from 'express';
import SaleItem from '../models/SaleItem.js';

const router = express.Router();

/**
 * GET /api/sale
 * Fetch current sale items (cancelled orders at discounted price)
 * Only returns items that haven't expired
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/sale
 */
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    const items = await SaleItem.find({ expiresAt: { $gt: now } }).sort({ expiresAt: 1 });
    res.json({ success: true, items, count: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sale
 * Create a new sale item (admin only)
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/sale
 * Body (JSON):
 * {
 *   "name": "Opera Cake (Whole)",
 *   "originalPrice": 560,
 *   "salePrice": 280,
 *   "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
 *   "expiresAt": 1715349600000,
 *   "quantity": 1,
 *   "reason": "Cancelled order - Flash sale!"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const item = new SaleItem(req.body);
    await item.save();
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/sale/:id
 * Remove expired sale item
 * 
 * POSTMAN TEST:
 * DELETE http://localhost:5000/api/sale/[item_id]
 */
router.delete('/:id', async (req, res) => {
  try {
    await SaleItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Sale item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
