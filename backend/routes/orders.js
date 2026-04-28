// routes/orders.js - Order management API endpoints
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

/**
 * POST /api/orders
 * Place a new order
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/orders
 * Body (JSON):
 * {
 *   "customer": {
 *     "name": "John Doe",
 *     "phone": "+91-9876543210",
 *     "email": "john@example.com"
 *   },
 *   "items": [
 *     { "itemId": "1", "name": "Sourdough Loaf", "price": 280 },
 *     { "itemId": "2", "name": "Butter Croissant", "price": 120 }
 *   ],
 *   "orderType": "pickup",
 *   "pickupTime": "2025-04-28T15:30:00",
 *   "notes": "Please keep it warm"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { customer, items, orderType, pickupTime, notes } = req.body;
    
    // Generate unique order ID
    const orderId = 'ORD-' + Date.now();
    
    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
    
    const order = new Order({
      orderId,
      customer,
      items,
      orderType,
      pickupTime,
      notes,
      totalAmount,
      status: 'pending',
    });
    
    await order.save();
    res.status(201).json({
      success: true,
      orderId,
      totalAmount,
      message: 'Order placed successfully',
      order,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/orders/:id
 * Get order status and details
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/orders/ORD-1715349600000
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/orders/:id
 * Update order status (admin)
 * 
 * POSTMAN TEST:
 * PATCH http://localhost:5000/api/orders/ORD-1715349600000
 * Body (JSON):
 * {
 *   "status": "confirmed"
 * }
 */
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, order, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/orders
 * List all orders (admin)
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/orders?status=pending
 * GET http://localhost:5000/api/orders
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
