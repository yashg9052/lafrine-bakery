// test-email.js - Diagnostic script for email connection
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Email Configuration...\n');
console.log('Email Config:');
console.log('  HOST:', process.env.EMAIL_HOST);
console.log('  PORT:', process.env.EMAIL_PORT);
console.log('  USER:', process.env.EMAIL_USER);
console.log('  PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

console.log('⏳ Connecting to Gmail SMTP...');
transporter.verify(async (error, success) => {
  if (error) {
    console.error('\n❌ Connection Failed!');
    console.error('Error:', error.message);
    console.error('\nPossible causes:');
    console.error('1. Invalid or expired App Password');
    console.error('2. 2-Step Verification not enabled on Gmail account');
    console.error('3. Network connectivity issue');
    console.error('4. Firewall blocking port 587');
    console.error('\nFix: Generate new App Password at myaccount.google.com/apppasswords');
    process.exit(1);
  } else {
    console.log('✓ Connection successful!\n');
    
    // Try sending test email
    console.log('📧 Sending test email...');
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"La Farine" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self
        subject: '🧪 La Farine Email Test',
        html: `<h2>Email System is Working! ✓</h2><p>If you see this, your email configuration is correct.</p>`,
      });
      
      console.log('✓ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('\n✅ All systems operational! Emails will now work.');
    } catch (emailErr) {
      console.error('❌ Failed to send test email:', emailErr.message);
    }
    
    process.exit(0);
  }
});
