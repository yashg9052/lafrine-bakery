// routes/email.js - Email testing API endpoints
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { sendOrderConfirmationEmail, sendPaymentConfirmationEmail } from '../utils/mailer.js';

dotenv.config();

const router = express.Router();

// ── HELPER: Create Email Transporter ──────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
};

/**
 * POST /api/email/test
 * Send a test email to verify email system is working
 *
 * POSTMAN TEST:
 * POST http://localhost:5000/api/email/test
 * Body (JSON):
 * {
 *   "to": "your-email@gmail.com",
 *   "subject": "Test Email"
 * }
 */
router.post('/test', async (req, res) => {
  try {
    const { to, subject } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address (to) is required' });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"La Farine Bakery" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || '🧪 Test Email from La Farine',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #faf6ef;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #3b2412;">✓ Email System is Working!</h2>
            <p style="color: #7a5c44; font-size: 16px;">
              If you received this email, your La Farine email configuration is <strong>properly configured</strong> ✓
            </p>
            <hr style="border: none; border-top: 1px solid #e0d0be; margin: 20px 0;">
            <p style="color: #7a5c44; font-size: 13px;">
              <strong>📋 Debug Information:</strong><br>
              Sent At: ${new Date().toISOString()}<br>
              From: ${process.env.EMAIL_USER}<br>
              To: ${to}<br>
              Environment: ${process.env.NODE_ENV || 'development'}
            </p>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 12px; margin-top: 20px;">
              <p style="margin: 0; color: #155724; font-weight: 600;">
                📧 <strong>Can't find this email?</strong><br>
                Check: Spam, Promotions, Updates, All Mail folders
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // ✅ `info` is defined BEFORE it is used
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId, // ✅ safe to use here
      recipient: to,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Email test error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      hint: 'Check .env file - EMAIL_USER and EMAIL_PASS must be valid Gmail credentials with App Password',
    });
  }
});

/**
 * POST /api/email/order-confirmation
 * Send an order confirmation email (manual trigger for testing)
 *
 * POSTMAN TEST:
 * POST http://localhost:5000/api/email/order-confirmation
 * Body (JSON):
 * {
 *   "to": "customer@gmail.com",
 *   "customerName": "John Doe",
 *   "orderId": "ORD-1234567890",
 *   "items": [
 *     { "name": "Sourdough Loaf", "price": 280 },
 *     { "name": "Butter Croissant", "price": 120 }
 *   ],
 *   "totalAmount": 400,
 *   "orderType": "pickup"
 * }
 */
router.post('/order-confirmation', async (req, res) => {
  try {
    const { to, customerName, orderId, items, totalAmount, orderType } = req.body;

    if (!to || !customerName || !orderId || !items || !totalAmount || !orderType) {
      return res.status(400).json({
        error: 'Missing required fields: to, customerName, orderId, items, totalAmount, orderType',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    await sendOrderConfirmationEmail(to, customerName, orderId, items, totalAmount, orderType);

    res.status(200).json({
      success: true,
      message: 'Order confirmation email sent successfully!',
      recipient: to,
      orderId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Order confirmation email error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/email/payment-confirmation
 * Send a payment confirmation email (manual trigger for testing)
 *
 * POSTMAN TEST:
 * POST http://localhost:5000/api/email/payment-confirmation
 * Body (JSON):
 * {
 *   "to": "customer@gmail.com",
 *   "customerName": "John Doe",
 *   "orderId": "ORD-1234567890",
 *   "paymentId": "PAY-1234567890",
 *   "amount": 400,
 *   "method": "card",
 *   "isPartial": false
 * }
 */
router.post('/payment-confirmation', async (req, res) => {
  try {
    const { to, customerName, orderId, paymentId, amount, method, isPartial } = req.body;

    if (!to || !customerName || !orderId || !paymentId || !amount || !method) {
      return res.status(400).json({
        error: 'Missing required fields: to, customerName, orderId, paymentId, amount, method',
      });
    }

    await sendPaymentConfirmationEmail(
      to,
      customerName,
      orderId,
      paymentId,
      amount,
      method,
      isPartial || false
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmation email sent successfully!',
      recipient: to,
      orderId,
      paymentId,
      amount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Payment confirmation email error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;