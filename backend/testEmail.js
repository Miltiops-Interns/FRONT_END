// Email Test Script
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 Testing Email Configuration...');
console.log('📧 Email Host:', process.env.EMAIL_HOST);
console.log('📧 Email Port:', process.env.EMAIL_PORT);
console.log('📧 Email User:', process.env.EMAIL_USER);
console.log('📧 Admin Email:', process.env.ADMIN_EMAIL);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email configuration
async function testEmail() {
  try {
    console.log('\n🔍 Verifying email configuration...');
    await transporter.verify();
    console.log('✅ Email configuration is valid!');

    console.log('\n📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Hotel Website - Email Test',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>This is a test email from your Hotel Website backend.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>To:</strong> ${process.env.ADMIN_EMAIL}</p>
        <hr>
        <p><em>If you received this email, your SMTP configuration is working correctly!</em></p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);

  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }

    // Common error solutions
    console.log('\n🔧 Common Solutions:');
    console.log('1. Check if 2-Step Verification is enabled in Gmail');
    console.log('2. Generate a new App Password in Google Account');
    console.log('3. Make sure EMAIL_PASS is the App Password (not your regular password)');
    console.log('4. Verify EMAIL_USER is your full Gmail address');
    console.log('5. Check if "Less secure app access" is enabled (if not using App Password)');
  }
}

// Run the test
testEmail();