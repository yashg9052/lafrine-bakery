// routes/payment.js - Payment processing API endpoints
import express from 'express';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { sendPaymentConfirmationEmail } from '../utils/mailer.js';

const router = express.Router();

/**
 * POST /api/payment/initiate
 * Initiate a payment (full or partial)
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/payment/initiate
 * Body (JSON):
 * {
 *   "orderId": "ORD-1715349600000",
 *   "amount": 400,
 *   "method": "card",
 *   "isPartial": false,
 *   "partialAmount": 0
 * }
 * 
 * For partial payment:
 * {
 *   "orderId": "ORD-1715349600000",
 *   "amount": 400,
 *   "method": "upi",
 *   "isPartial": true,
 *   "partialAmount": 200
 * }
 */
router.post('/initiate', async (req, res) => {
  try {
    const { orderId, amount, method, isPartial, partialAmount } = req.body;
    
    // Generate payment ID
    const paymentId = 'PAY-' + Date.now();
    
    const payment = new Payment({
      paymentId,
      orderId,
      amount,
      method,
      isPartial,
      partialAmount: isPartial ? partialAmount : 0,
      status: 'pending',
    });
    
    await payment.save();
    
    res.status(201).json({
      success: true,
      paymentId,
      amount,
      method,
      message: 'Payment initiated',
      redirectUrl: `https://payment-gateway.example.com/pay?paymentId=${paymentId}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/payment/verify
 * Verify payment and update order status (mock verification)
 * 
 * POSTMAN TEST:
 * POST http://localhost:5000/api/payment/verify
 * Body (JSON):
 * {
 *   "paymentId": "PAY-1715349600000",
 *   "orderId": "ORD-1715349600000"
 * }
 */
router.post('/verify', async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;
    
    // Simulate payment success (in production, verify with gateway)
    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: 'success', updatedAt: new Date() },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        status: 'confirmed',
        payment: {
          method: payment.method,
          paidAmount: payment.isPartial ? payment.partialAmount : payment.amount,
          remainingAmount: payment.isPartial ? payment.amount - payment.partialAmount : 0,
          status: 'success',
        },
        updatedAt: new Date(),
      },
      { new: true }
    );
    
    // ── SEND PAYMENT CONFIRMATION EMAIL IMMEDIATELY ──────────────────
    if (order && order.customer && order.customer.email) {
      try {
        await sendPaymentConfirmationEmail(
          order.customer.email,
          order.customer.name || 'Valued Customer',
          orderId,
          paymentId,
          payment.isPartial ? payment.partialAmount : payment.amount,
          payment.method,
          payment.isPartial
        );
        console.log(`✓ Payment confirmation email sent for order ${orderId}`);
      } catch (emailErr) {
        console.error(`✗ Failed to send payment confirmation email for ${orderId}:`, emailErr.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
      order,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/payment/:paymentId
 * Get payment status
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/payment/PAY-1715349600000
 */
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
