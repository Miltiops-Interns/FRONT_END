const nodemailer = require("nodemailer");
require("dotenv").config();

// Email debug toggle (enable verbose logging in production only when needed)
const EMAIL_DEBUG =
  String(process.env.DEBUG_EMAIL || "").toLowerCase() === "true";

// 🔍 COMPREHENSIVE ENVIRONMENT VARIABLE LOGGING
console.log("🔍 [Email Debug] Environment Variables Check:");
console.log("  EMAIL_HOST:", process.env.EMAIL_HOST || "[MISSING]");
console.log("  EMAIL_PORT:", process.env.EMAIL_PORT || "[MISSING]");
console.log(
  "  EMAIL_USER:",
  process.env.EMAIL_USER
    ? `${process.env.EMAIL_USER.slice(0, 3)}****`
    : "[MISSING]"
);
console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "[SET]" : "[MISSING]");
console.log("  ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "[MISSING]");
console.log("  DEBUG_EMAIL:", process.env.DEBUG_EMAIL || "[NOT SET]");
console.log("  NODE_ENV:", process.env.NODE_ENV || "[NOT SET]");

// Build a non-sensitive snapshot of config for logs
const safeEmailConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || undefined,
  secure: String(process.env.EMAIL_PORT || "") == "465",
  userMasked: process.env.EMAIL_USER
    ? `${String(process.env.EMAIL_USER).slice(0, 2)}****`
    : undefined,
  from: process.env.EMAIL_USER,
  to: process.env.ADMIN_EMAIL,
};
console.log("[Email] Config:", safeEmailConfig);

// 🔍 SMTP TRANSPORTER CREATION WITH DETAILED LOGGING
console.log("🔍 [SMTP] Creating transporter with config:");
console.log("  Host:", process.env.EMAIL_HOST);
console.log("  Port:", process.env.EMAIL_PORT);
console.log("  Secure:", process.env.EMAIL_PORT == 465);
console.log(
  "  User:",
  process.env.EMAIL_USER
    ? `${process.env.EMAIL_USER.slice(0, 3)}****`
    : "[MISSING]"
);
console.log("  Pass:", process.env.EMAIL_PASS ? "[SET]" : "[MISSING]");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: EMAIL_DEBUG,
  debug: EMAIL_DEBUG,
});

// 🔍 ALWAYS VERIFY SMTP CONNECTION ON STARTUP
console.log("🔍 [SMTP] Verifying connection...");
transporter
  .verify()
  .then(() => {
    console.log("✅ [SMTP] Connection verified successfully");
    console.log("✅ [SMTP] Ready to send emails");
  })
  .catch((err) => {
    console.error("❌ [SMTP] Connection verification FAILED:");
    console.error("❌ [SMTP] Error message:", err.message || err);
    console.error("❌ [SMTP] Error code:", err.code || "N/A");
    console.error("❌ [SMTP] Error response:", err.response || "N/A");
    console.error("❌ [SMTP] Full error:", err);

    // 🔍 SPECIFIC GOOGLE BLOCKING DETECTION
    if (err.message && err.message.includes("Invalid login")) {
      console.error(
        "🚨 [SMTP] GOOGLE BLOCKING DETECTED: Invalid login credentials"
      );
      console.error(
        "🚨 [SMTP] Check if 'Less secure app access' is enabled or use App Password"
      );
    }
    if (err.message && err.message.includes("Authentication failed")) {
      console.error(
        "🚨 [SMTP] AUTHENTICATION FAILED: Check credentials and app password"
      );
    }
    if (err.message && err.message.includes("Connection timeout")) {
      console.error(
        "🚨 [SMTP] CONNECTION TIMEOUT: Check network/firewall settings"
      );
    }
  });

// Function to send notification email
const sendNotificationEmail = async (type, data) => {
  try {
    console.log("🔍 [Email] Send attempt started:");
    console.log("  Type:", type);
    console.log("  To:", process.env.ADMIN_EMAIL);
    console.log("  Host:", process.env.EMAIL_HOST);
    console.log("  Port:", Number(process.env.EMAIL_PORT) || undefined);
    console.log("  Secure:", String(process.env.EMAIL_PORT || "") == "465");
    console.log("  Data keys:", Object.keys(data || {}));
    let subject = "";
    let html = "";

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
      case "contact":
        subject = "🍽️ New Contact Message - Restaurant Admin Alert";
        html = createEmailTemplate(
          "New Contact Message",
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
                  <div class="value">${data.phone || "Not provided"}</div>
                </div>
              </div>
            </div>
            <div class="message-section">
              <div class="label">💬 Message</div>
              <div style="margin-top: 12px; white-space: pre-wrap; color: #111827;">${
                data.message
              }</div>
            </div>
          `,
          "#0ea5e9",
          "💬"
        );
        break;

      case "reservation":
        subject = "🍽️ New Reservation Request - Restaurant Admin Alert";
        html = createEmailTemplate(
          "New Reservation",
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
                  <div class="value">${new Date(
                    data.date
                  ).toLocaleDateString()}</div>
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
            ${
              data.specialRequests
                ? `
            <div class="message-section">
              <div class="label">🎯 Special Requests</div>
              <div style="margin-top: 12px; color: #111827;">${data.specialRequests}</div>
            </div>
            `
                : ""
            }
          `,
          "#10b981",
          "📅"
        );
        break;

      case "order":
        subject = "🍽️ New Order Received - Restaurant Admin Alert";
        const itemsList = data.items
          .map(
            (item) => `
          <div class="order-item">
            <div>
              <span class="item-name">${item.name}</span>
              <span class="item-quantity">x${item.quantity}</span>
            </div>
            <span class="item-price">₹${item.price * item.quantity}</span>
          </div>
        `
          )
          .join("");

        html = createEmailTemplate(
          "New Order",
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
                  <div class="value">${data.whatsapp || "Not provided"}</div>
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
          "#ef4444",
          "🛒"
        );
        break;

      default:
        throw new Error("Unknown notification type");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: html,
    };

    console.log("🔍 [Email] Attempting to send mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Email] Send success:");
    console.log(
      "  Message ID:",
      info && info.messageId ? info.messageId : "N/A"
    );
    console.log("  Response:", info && info.response ? info.response : "N/A");
    console.log("  Accepted:", info && info.accepted ? info.accepted : "N/A");
    console.log("  Rejected:", info && info.rejected ? info.rejected : "N/A");
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [Email] Send error occurred:");
    console.error(
      "  Error message:",
      error && error.message ? error.message : "Unknown error"
    );
    console.error("  Error code:", error && error.code ? error.code : "N/A");
    console.error(
      "  Error response:",
      error && error.response ? error.response : "N/A"
    );
    console.error(
      "  Error command:",
      error && error.command ? error.command : "N/A"
    );
    console.error("  Full error object:", error);

    // 🔍 SPECIFIC ERROR DETECTION
    if (error.message && error.message.includes("Invalid login")) {
      console.error(
        "🚨 [Email] GOOGLE BLOCKING: Invalid login - use App Password"
      );
    }
    if (error.message && error.message.includes("Authentication failed")) {
      console.error("🚨 [Email] AUTH FAILED: Check credentials");
    }
    if (error.message && error.message.includes("Connection timeout")) {
      console.error("🚨 [Email] TIMEOUT: Network/firewall issue");
    }
    if (error.message && error.message.includes("ENOTFOUND")) {
      console.error("🚨 [Email] DNS ERROR: Cannot resolve SMTP host");
    }

    return { success: false, error: error.message };
  }
};

const verifyTransport = async () => {
  try {
    console.log("🔍 [Email] Verifying transport...");
    await transporter.verify();
    console.log("✅ [Email] Transport verification successful");
    return { ok: true };
  } catch (err) {
    console.error("❌ [Email] Transport verification failed:");
    console.error("  Error:", err && err.message ? err.message : String(err));
    console.error("  Code:", err && err.code ? err.code : "N/A");
    console.error("  Response:", err && err.response ? err.response : "N/A");
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
};

module.exports = { sendNotificationEmail, verifyTransport };
