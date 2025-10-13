const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with alternative SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465, // Use port 465 for SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Aggressive timeout settings for Render free tier
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 15000,   // 15 seconds
  socketTimeout: 30000,     // 30 seconds
  // Disable pooling for free tier
  pool: false,
  // Retry settings
  retryDelay: 1000,
  maxRetries: 3,
  // TLS settings
  tls: {
    rejectUnauthorized: false
  }
});

// Function to send notification email
const sendNotificationEmail = async (type, data) => {
  try {
    let subject = '';
    let html = '';

    // Simple and Attractive Email Template
    const createEmailTemplate = (title, content, typeColor, icon) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 24px 20px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '${icon}';
            font-size: 32px;
            display: block;
            margin-bottom: 8px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.025em;
          }
          .notification-banner {
            background: ${typeColor};
            color: white;
            padding: 12px 20px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.025em;
            text-transform: uppercase;
          }
          .content {
            padding: 32px 24px;
          }
          .info-grid {
            display: grid;
            gap: 16px;
            margin: 24px 0;
          }
          .info-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 3px solid ${typeColor};
          }
          .info-icon {
            width: 20px;
            margin-right: 12px;
            opacity: 0.7;
          }
          .info-content {
            flex: 1;
          }
          .label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
          }
          .value {
            font-size: 14px;
            color: #111827;
            font-weight: 500;
          }
          .message-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-section .label {
            color: #92400e;
          }
          .order-items {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
          }
          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .order-item:last-child {
            border-bottom: none;
          }
          .item-name {
            font-weight: 500;
            color: #374151;
          }
          .item-quantity {
            color: #6b7280;
            font-size: 13px;
            margin-left: 8px;
          }
          .item-price {
            font-weight: 600;
            color: #059669;
          }
          .order-total {
            background: ${typeColor};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            margin-top: 16px;
          }
          .cta-section {
            text-align: center;
            margin: 32px 0 24px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.025em;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            transition: all 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
          }
          .footer {
            background: #f8fafc;
            padding: 24px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            color: #6b7280;
            font-size: 13px;
            margin: 0 0 8px 0;
          }
          .timestamp {
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Restaurant Admin</h1>
          </div>
          <div class="notification-banner">
            🚨 New Notification - Check your Dashboard
          </div>
          <div class="content">
            ${content}
            <div class="cta-section">
              <a href="#" class="cta-button">📊 View in Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">Automated notification from your Restaurant Management System</p>
            <div class="timestamp">
              ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    switch (type) {
      case 'contact':
        subject = '🍽️ New Contact Message - Restaurant Admin Alert';
        html = createEmailTemplate(
          'New Contact Message',
          `
            <h2 style="color: #374151; margin-bottom: 24px; text-align: center;">📬 New Contact Message Received</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-icon">👤</span>
                <div class="info-content">
                  <div class="label">Name</div>
                  <div class="value">${data.name}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📧</span>
                <div class="info-content">
                  <div class="label">Email</div>
                  <div class="value">${data.email}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📞</span>
                <div class="info-content">
                  <div class="label">Phone</div>
                  <div class="value">${data.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>
            <div class="message-section">
              <div class="label">💬 Message</div>
              <div style="margin-top: 12px; white-space: pre-wrap; color: #111827;">${data.message}</div>
            </div>
          `,
          '#0ea5e9',
          '💬'
        );
        break;

      case 'reservation':
        subject = '🍽️ New Reservation Request - Restaurant Admin Alert';
        html = createEmailTemplate(
          'New Reservation',
          `
            <h2 style="color: #374151; margin-bottom: 24px; text-align: center;">📅 New Reservation Request</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-icon">👤</span>
                <div class="info-content">
                  <div class="label">Name</div>
                  <div class="value">${data.name}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📧</span>
                <div class="info-content">
                  <div class="label">Email</div>
                  <div class="value">${data.email}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📞</span>
                <div class="info-content">
                  <div class="label">Phone</div>
                  <div class="value">${data.phone}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📅</span>
                <div class="info-content">
                  <div class="label">Date</div>
                  <div class="value">${new Date(data.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">⏰</span>
                <div class="info-content">
                  <div class="label">Time</div>
                  <div class="value">${data.time}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">👥</span>
                <div class="info-content">
                  <div class="label">Guests</div>
                  <div class="value">${data.guests}</div>
                </div>
              </div>
            </div>
            ${data.specialRequests ? `
            <div class="message-section">
              <div class="label">🎯 Special Requests</div>
              <div style="margin-top: 12px; color: #111827;">${data.specialRequests}</div>
            </div>
            ` : ''}
          `,
          '#10b981',
          '📅'
        );
        break;

      case 'order':
        subject = '🍽️ New Order Received - Restaurant Admin Alert';
        const itemsList = data.items.map(item => `
          <div class="order-item">
            <div>
              <span class="item-name">${item.name}</span>
              <span class="item-quantity">x${item.quantity}</span>
            </div>
            <span class="item-price">₹${item.price * item.quantity}</span>
          </div>
        `).join('');

        html = createEmailTemplate(
          'New Order',
          `
            <h2 style="color: #374151; margin-bottom: 24px; text-align: center;">🛒 New Order Received</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-icon">👤</span>
                <div class="info-content">
                  <div class="label">Customer</div>
                  <div class="value">${data.customerName}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📞</span>
                <div class="info-content">
                  <div class="label">Phone</div>
                  <div class="value">${data.phone}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">💬</span>
                <div class="info-content">
                  <div class="label">WhatsApp</div>
                  <div class="value">${data.whatsapp || 'Not provided'}</div>
                </div>
              </div>
            </div>
            <div class="order-items">
              <h3 style="margin-top: 0; color: #374151; margin-bottom: 16px;">📋 Order Items</h3>
              ${itemsList}
              <div class="order-total">
                💰 Total: ₹${data.totalPrice}
              </div>
            </div>
          `,
          '#ef4444',
          '🛒'
        );
        break;

      default:
        throw new Error('Unknown notification type');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendNotificationEmail };