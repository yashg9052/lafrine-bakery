// utils/mailer.js - Nodemailer email service for La Farine Bakery
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ── TRANSPORTER ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
  pool: true,         // ✅ pool must be a top-level boolean, not an object
  maxConnections: 5,  // ✅ these go at the top level, not nested inside pool: {}
  maxMessages: 100,
});

// Verify transporter on startup
transporter.verify()
  .then(() => console.log('✓ Email transporter ready'))
  .catch(err => {
    console.error('✗ Email transporter error:');
    console.error('  Error:', err.message);
    console.error('  Ensure:');
    console.error('  1. Gmail account has 2-Step Verification enabled');
    console.error('  2. App Password is valid (generated from myaccount.google.com)');
    console.error('  3. EMAIL_USER and EMAIL_PASS are correct in .env');
    console.error('  4. Your network can reach smtp.gmail.com:587');
  });

// ── ORDER CONFIRMATION EMAIL ──────────────────────────────────
/**
 * Send an order confirmation email immediately after order is placed
 * @param {string} to - Customer email address
 * @param {string} customerName - Customer's name
 * @param {string} orderId - Order ID
 * @param {Array} items - Array of { name, price }
 * @param {number} totalAmount - Total order amount
 * @param {string} orderType - 'pickup' or 'delivery'
 */
export async function sendOrderConfirmationEmail(to, customerName, orderId, items, totalAmount, orderType) {
  const isPickup = orderType === 'pickup';

  const headline = 'Your Order is Confirmed!';

  const statusMessage = isPickup
    ? 'Your order will be <strong style="color:#c2813a;">ready for pickup in 30 minutes</strong> at La Farine Bakery.'
    : 'Your order will be <strong style="color:#c2813a;">delivered to you in 30 minutes</strong>.';

  const ctaText = isPickup ? 'Pick Up in 30 Minutes' : 'Arriving in 30 Minutes';

  const locationBlock = isPickup
    ? `<!-- Pickup Address -->
              <div style="background:#fff9f2;border:1px solid #e0d0be;border-radius:6px;padding:16px;text-align:center;">
                <p style="margin:0 0 4px;font-size:13px;color:#7a5c44;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">📍 Pickup Location</p>
                <p style="margin:0;font-size:14px;color:#3b2412;line-height:1.5;">
                  12, Hill Road, Bandra West<br />Mumbai 400050
                </p>
                <p style="margin:8px 0 0;font-size:13px;color:#7a5c44;">
                  📞 +91 98765 43210
                </p>
              </div>`
    : `<!-- Delivery Info -->
              <div style="background:#fff9f2;border:1px solid #e0d0be;border-radius:6px;padding:16px;text-align:center;">
                <p style="margin:0 0 4px;font-size:13px;color:#7a5c44;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">🚚 Delivery Update</p>
                <p style="margin:0;font-size:14px;color:#3b2412;line-height:1.5;">
                  Our delivery partner will reach you in approximately 30 minutes.
                </p>
                <p style="margin:8px 0 0;font-size:13px;color:#7a5c44;">
                  📞 Contact us: +91 98765 43210
                </p>
              </div>`;

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e6da;color:#3b2412;font-size:14px;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e6da;color:#c2813a;font-weight:600;text-align:right;font-size:14px;">₹${item.price}</td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#faf6ef;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#fffdf9;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(59,36,18,0.10);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b2412 0%,#5c3420 100%);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:900;color:#e8a94b;letter-spacing:1px;">
                La Farine
              </h1>
              <p style="margin:4px 0 0;color:#d4b896;font-size:13px;font-style:italic;">Artisan Bakery</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Icon -->
              <div style="text-align:center;margin-bottom:20px;">
                <span style="font-size:48px;">${isPickup ? '🥐' : '🚚'}</span>
              </div>

              <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;color:#3b2412;font-size:22px;text-align:center;">
                ${headline}
              </h2>
              <p style="margin:0 0 24px;color:#7a5c44;font-size:14px;text-align:center;line-height:1.6;">
                Hi <strong style="color:#3b2412;">${customerName}</strong>, thank you for your order!<br/>
                ${statusMessage}
              </p>

              <!-- Order ID Badge -->
              <div style="background:#fff9f2;border:1.5px solid #e0d0be;border-radius:6px;padding:12px 16px;text-align:center;margin-bottom:20px;">
                <span style="font-size:12px;color:#7a5c44;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Order ID</span>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#c2813a;margin-top:4px;">${orderId}</div>
                <div style="margin-top:6px;font-size:12px;color:#7a5c44;text-transform:uppercase;letter-spacing:0.5px;">${isPickup ? '📦 Pickup Order' : '🚚 Delivery Order'}</div>
              </div>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:8px 12px;border-bottom:2px solid #e0d0be;font-size:11px;color:#7a5c44;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Item</td>
                  <td style="padding:8px 12px;border-bottom:2px solid #e0d0be;font-size:11px;color:#7a5c44;text-transform:uppercase;letter-spacing:1px;font-weight:600;text-align:right;">Price</td>
                </tr>
                ${itemRows}
                <tr>
                  <td style="padding:12px;font-weight:700;color:#3b2412;font-size:15px;border-top:2px solid #e0d0be;">Total</td>
                  <td style="padding:12px;font-weight:700;color:#c2813a;font-size:17px;text-align:right;border-top:2px solid #e0d0be;">₹${totalAmount}</td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin:28px 0 16px;">
                <span style="display:inline-block;background:#e8a94b;color:#3b2412;padding:12px 32px;border-radius:4px;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;">
                  ${ctaText}
                </span>
              </div>

              ${locationBlock}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#3b2412;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#c9a88a;font-size:12px;">
                <strong style="color:#e8a94b;font-family:Georgia,'Times New Roman',serif;">La Farine</strong> · Artisan Bakery · Mumbai, India
              </p>
              <p style="margin:6px 0 0;color:rgba(201,168,138,0.6);font-size:11px;">
                Baked with love, served with soul.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const subjectEmoji = isPickup ? '🥐' : '🚚';
  const subjectAction = isPickup ? 'Ready for Pickup in 30 min' : 'Delivery in 30 min';

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"La Farine Bakery" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subjectEmoji} Order ${orderId} Confirmed — ${subjectAction}! — La Farine`,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Confirmation email sent to ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`✗ Failed to send confirmation email to ${to}:`, err.message);
    throw err;
  }
}

// ── PAYMENT CONFIRMATION EMAIL ─────────────────────────────────
/**
 * Send a payment confirmation email immediately after payment is verified
 * @param {string} to - Customer email address
 * @param {string} customerName - Customer's name
 * @param {string} orderId - Order ID
 * @param {string} paymentId - Payment ID
 * @param {number} amount - Payment amount
 * @param {string} method - Payment method (card, upi, etc)
 * @param {boolean} isPartial - Whether it's a partial payment
 */
export async function sendPaymentConfirmationEmail(to, customerName, orderId, paymentId, amount, method, isPartial) {
  const paymentMethodIcon = {
    'card': '💳',
    'upi': '📱',
    'wallet': '👛',
    'netbanking': '🏦',
  }[method] || '💰';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#faf6ef;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#fffdf9;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(59,36,18,0.10);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b2412 0%,#5c3420 100%);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:900;color:#e8a94b;letter-spacing:1px;">
                La Farine
              </h1>
              <p style="margin:4px 0 0;color:#d4b896;font-size:13px;font-style:italic;">Artisan Bakery</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Icon -->
              <div style="text-align:center;margin-bottom:20px;">
                <span style="font-size:48px;">${paymentMethodIcon}</span>
              </div>

              <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;color:#3b2412;font-size:22px;text-align:center;">
                ${isPartial ? 'Partial Payment Received!' : 'Payment Confirmed!'}
              </h2>
              <p style="margin:0 0 24px;color:#7a5c44;font-size:14px;text-align:center;line-height:1.6;">
                Hi <strong style="color:#3b2412;">${customerName}</strong>, your payment has been successfully processed.
              </p>

              <!-- Success Badge -->
              <div style="background:#d4edda;border:1px solid #c3e6cb;border-radius:6px;padding:16px;text-align:center;margin-bottom:20px;">
                <span style="font-size:28px;">✓</span>
                <p style="margin:8px 0 0;color:#155724;font-weight:600;font-size:14px;">Payment Successful</p>
              </div>

              <!-- Payment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:12px;background:#fff9f2;border-bottom:1px solid #e0d0be;color:#7a5c44;font-size:13px;font-weight:600;text-transform:uppercase;">Order ID</td>
                  <td style="padding:12px;background:#fff9f2;border-bottom:1px solid #e0d0be;color:#c2813a;font-weight:700;font-size:14px;text-align:right;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:12px;background:#ffffff;border-bottom:1px solid #e0d0be;color:#7a5c44;font-size:13px;font-weight:600;text-transform:uppercase;">Payment ID</td>
                  <td style="padding:12px;background:#ffffff;border-bottom:1px solid #e0d0be;color:#3b2412;font-weight:600;font-size:13px;text-align:right;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding:12px;background:#fff9f2;border-bottom:1px solid #e0d0be;color:#7a5c44;font-size:13px;font-weight:600;text-transform:uppercase;">Payment Method</td>
                  <td style="padding:12px;background:#fff9f2;border-bottom:1px solid #e0d0be;color:#3b2412;font-weight:600;font-size:13px;text-align:right;">
                    ${method.charAt(0).toUpperCase() + method.slice(1)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px;background:#ffffff;color:#7a5c44;font-size:13px;font-weight:600;text-transform:uppercase;">Amount Paid</td>
                  <td style="padding:12px;background:#ffffff;color:#27ae60;font-weight:700;font-size:16px;text-align:right;">₹${amount}</td>
                </tr>
              </table>

              <!-- Info Box -->
              <div style="background:#fff9f2;border:1px solid #e0d0be;border-radius:6px;padding:16px;margin-bottom:20px;">
                <p style="margin:0;font-size:13px;color:#7a5c44;line-height:1.6;">
                  <strong style="color:#3b2412;">📌 Next Steps:</strong><br/>
                  Your order is being prepared. Check your orders page for real-time updates or contact us for status.
                </p>
              </div>

              <!-- Contact Info -->
              <div style="text-align:center;background:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:16px;">
                <p style="margin:0;font-size:12px;color:#7a5c44;">
                  <strong>Need Help?</strong><br/>
                  📞 +91 98765 43210 | 📧 support@lafarine.com
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#3b2412;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#c9a88a;font-size:12px;">
                <strong style="color:#e8a94b;font-family:Georgia,'Times New Roman',serif;">La Farine</strong> · Artisan Bakery · Mumbai, India
              </p>
              <p style="margin:6px 0 0;color:rgba(201,168,138,0.6);font-size:11px;">
                Baked with love, served with soul.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"La Farine Bakery" <${process.env.EMAIL_USER}>`,
    to,
    subject: `💳 Payment Confirmed for Order ${orderId} — La Farine`,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Payment confirmation email sent to ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`✗ Failed to send payment confirmation email to ${to}:`, err.message);
    throw err;
  }
}