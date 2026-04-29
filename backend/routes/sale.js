// routes/sale.js - Last Minute Sale API endpoints
import express from 'express';
import SaleItem from '../models/SaleItem.js';

const router = express.Router();

// ── HELPER: Generate random expiry time (1-120 minutes, max 2 hours) ──────
/**
 * Generate a random expiry timestamp between 1 to 120 minutes from now
 * @returns {number} Timestamp in milliseconds when sale expires
 */
function generateRandomExpiry() {
  const MIN_MINUTES = 1;
  const MAX_MINUTES = 120; // 2 hours
  
  // Random minutes between MIN and MAX
  const randomMinutes = Math.floor(Math.random() * (MAX_MINUTES - MIN_MINUTES + 1)) + MIN_MINUTES;
  
  // Convert to milliseconds and add to current time
  const expiryTime = Date.now() + (randomMinutes * 60 * 1000);
  
  return expiryTime;
}

/**
 * GET /api/sale
 * Fetch current sale items (cancelled orders at discounted price)
 * Only returns items that haven't expired
 * Also includes time remaining for each item
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/sale
 */
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    const items = await SaleItem.find({ expiresAt: { $gt: now } }).sort({ expiresAt: 1 });
    
    // Add time remaining to each item
    const itemsWithTimeRemaining = items.map(item => ({
      ...item.toObject(),
      timeRemaining: {
        milliseconds: item.expiresAt.getTime() - now,
        minutes: Math.round((item.expiresAt.getTime() - now) / (60 * 1000)),
        seconds: Math.round((item.expiresAt.getTime() - now) / 1000),
        display: `${Math.round((item.expiresAt.getTime() - now) / (60 * 1000))} min remaining`,
      },
    }));
    
    res.json({ success: true, items: itemsWithTimeRemaining, count: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sale
 * Create a new sale item (admin only)
 * Automatically generates random expiry time (1-120 minutes)
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/sale
 * Body (JSON):
 * {
 *   "name": "Opera Cake (Whole)",
 *   "originalPrice": 560,
 *   "salePrice": 280,
 *   "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
 *   "quantity": 1,
 *   "reason": "Cancelled order - Flash sale!"
 * }
 * 
 * NOTE: expiresAt is automatically set to a random time between 1-120 minutes
 */
router.post('/', async (req, res) => {
  try {
    const { name, originalPrice, salePrice, image, quantity, reason } = req.body;
    
    // Generate random expiry time (1-120 minutes from now)
    const expiresAt = generateRandomExpiry();
    const randomMinutes = Math.round((expiresAt - Date.now()) / (60 * 1000));
    
    const item = new SaleItem({
      name,
      originalPrice,
      salePrice,
      image,
      quantity: quantity || 1,
      reason: reason || 'Cancelled order - Flash sale!',
      expiresAt: new Date(expiresAt),
    });
    
    await item.save();
    
    res.status(201).json({
      success: true,
      item,
      expiresIn: `${randomMinutes} minutes`,
      message: `Sale item created! Will expire in ${randomMinutes} minutes.`,
    });
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
