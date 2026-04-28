// routes/menu.js - Menu API endpoints
import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

/**
 * GET /api/menu
 * Fetch all menu items or filter by category
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/menu
 * GET http://localhost:5000/api/menu?cat=bread
 * GET http://localhost:5000/api/menu?cat=pastry
 * GET http://localhost:5000/api/menu?cat=cake
 * GET http://localhost:5000/api/menu?cat=drink
 * 
 * Query Params:
 *   cat (optional): 'bread', 'pastry', 'cake', 'drink', or 'all'
 */
router.get('/', async (req, res) => {
  try {
    const { cat } = req.query;
    const filter = cat && cat !== 'all' ? { cat } : {};
    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/menu
 * Add a new menu item (for admin)
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/menu
 * Body (JSON):
 * {
 *   "name": "Sourdough Loaf",
 *   "cat": "bread",
 *   "price": 280,
 *   "tag": "new",
 *   "desc": "Long-fermented, crispy crust, chewy crumb",
 *   "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/menu/:id
 * Get single menu item
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/menu/[item_id]
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
