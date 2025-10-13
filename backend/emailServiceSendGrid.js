// Alternative Email Service using SendGrid (more reliable for Render)
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send notification email using SendGrid
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
          }
          .content {
            padding: 32px 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Restaurant Admin</h1>
          </div>
          <div class="content">
            ${content}
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
            <h2>📬 New Contact Message Received</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          `
        );
        break;

      case 'reservation':
        subject = '🍽️ New Reservation Request - Restaurant Admin Alert';
        html = createEmailTemplate(
          'New Reservation',
          `
            <h2>📅 New Reservation Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ''}
          `
        );
        break;

      case 'order':
        subject = '🍽️ New Order Received - Restaurant Admin Alert';
        const itemsList = data.items.map(item => 
          `<li>${item.name} × ${item.quantity} - ₹${item.price * item.quantity}</li>`
        ).join('');
        
        html = createEmailTemplate(
          'New Order',
          `
            <h2>🛒 New Order Received</h2>
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>WhatsApp:</strong> ${data.whatsapp || 'Not provided'}</p>
            <h3>Order Items:</h3>
            <ul>${itemsList}</ul>
            <p><strong>Total: ₹${data.totalPrice}</strong></p>
          `
        );
        break;

      default:
        throw new Error('Unknown notification type');
    }

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_USER,
      subject: subject,
      html: html,
    };

    const result = await sgMail.send(msg);
    console.log('SendGrid email sent:', result[0].statusCode);
    return { success: true, messageId: result[0].headers['x-message-id'] };
  } catch (error) {
    console.error('SendGrid email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendNotificationEmail };
