const { Resend } = require("resend");
const path = require("path");

// Try to load .env from multiple locations
try {
  // Try backend/.env first (relative to this file)
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
} catch (err) {
  // Fall back to root .env or default dotenv behavior
  require("dotenv").config();
}

// Email debug toggle (enable verbose logging in production only when needed)
const EMAIL_DEBUG =
  String(process.env.DEBUG_EMAIL || "").toLowerCase() === "true";

// 🔍 COMPREHENSIVE ENVIRONMENT VARIABLE LOGGING
console.log("🔍 [Resend Email] Environment Variables Check:");
console.log("  RESEND_API_KEY:", process.env.RESEND_API_KEY ? "[SET]" : "[MISSING - REQUIRED]");
console.log("  ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "[MISSING]");
console.log("  EMAIL_FROM:", process.env.EMAIL_FROM || "[MISSING]");
console.log("  DEBUG_EMAIL:", process.env.DEBUG_EMAIL || "[NOT SET]");
console.log("  NODE_ENV:", process.env.NODE_ENV || "[NOT SET]");

// Initialize Resend client function (callable multiple times)
const initializeResend = () => {
  // Reload environment variables to ensure we have the latest values
  require("dotenv").config();
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('re_')) {
    console.error("❌ [Resend Email] RESEND_API_KEY is required but not set or invalid!");
    console.error("❌ [Resend Email] Current value:", apiKey ? `${apiKey.substring(0, 10)}...` : "[UNDEFINED]");
    console.error("❌ [Resend Email] Please add RESEND_API_KEY=re_... to your .env file");
    return null;
  }
  return new Resend(apiKey);
};

// Initialize Resend client at module load
let resend = initializeResend();
if (resend) {
  console.log("✅ [Resend Email] Client initialized successfully");
}

// Function to send notification email
const sendNotificationEmail = async (type, data) => {
  try {
    // Re-check and re-initialize if needed (in case env vars were loaded later)
    if (!resend) {
      resend = initializeResend();
      if (!resend) {
        throw new Error("RESEND_API_KEY is required for sending emails. Please check your .env file.");
      }
    }

    console.log("🔍 [Resend Email] Send attempt started:");
    console.log("  Type:", type);
    console.log("  To:", process.env.ADMIN_EMAIL);
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

    // Send using Resend API
    let senderEmail = process.env.EMAIL_FROM || process.env.ADMIN_EMAIL;
    const toEmail = process.env.ADMIN_EMAIL;
    
    // Remove display name format - Resend requires plain email without display name
    // unless domain is verified. Extract just the email if display name is present.
    if (senderEmail.includes('<') && senderEmail.includes('>')) {
      const match = senderEmail.match(/<([^>]+)>/);
      if (match) {
        senderEmail = match[1]; // Extract email from "Name <email>"
      }
    }
    
    // Resend doesn't allow sending from Gmail or other free email providers
    // Use Resend's test domain if sender is from a free email provider
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const senderDomain = senderEmail?.split('@')[1]?.toLowerCase();
    
    if (senderDomain && freeEmailDomains.includes(senderDomain)) {
      console.log("⚠️  [Resend API] Gmail/free email detected, using Resend test domain");
      senderEmail = 'onboarding@resend.dev';
    }
    
    // Fallback to Resend test domain if EMAIL_FROM is not set or is invalid
    if (!senderEmail || !senderEmail.includes('@')) {
      console.log("⚠️  [Resend API] EMAIL_FROM not set or invalid, using Resend test domain");
      senderEmail = 'onboarding@resend.dev';
    }
    
    console.log("🔍 [Resend API] Attempting to send email...");
    console.log("  From:", senderEmail);
    console.log("  To:", toEmail);
    console.log("  Subject:", subject);
    console.log("  HTML length:", html.length, "characters");
    
    try {
      const response = await resend.emails.send({
        from: senderEmail,
        to: toEmail,
        subject: subject,
        html: html,
      });
      
      // Resend returns { data, error } structure
      if (response.error) {
        console.error("❌ [Resend API] Error in response:", response.error);
        throw new Error(response.error.message || JSON.stringify(response.error));
      }
      
      if (!response.data || !response.data.id) {
        console.error("❌ [Resend API] No data or ID in response:", response);
        throw new Error("Resend API returned invalid response");
      }
      
      console.log("✅ [Resend API] Send success:");
      console.log("  Message ID:", response.data.id);
      return { success: true, messageId: response.data.id };
    } catch (resendError) {
      // If it's already an Error object, rethrow it
      if (resendError instanceof Error) {
        throw resendError;
      }
      // Otherwise, wrap it
      throw new Error(resendError?.message || String(resendError));
    }
  } catch (error) {
    console.error("❌ [Email] Send error occurred:");
    console.error(
      "  Error message:",
      error && error.message ? error.message : "Unknown error"
    );
    console.error("  Error code:", error && error.code ? error.code : "N/A");
    console.error("  Full error object:", error);

    // 🔍 SPECIFIC ERROR DETECTION
    let errorMessage = error.message || "Unknown error";
    
    // Log full error details for debugging
    if (EMAIL_DEBUG) {
      console.error("  Full error:", JSON.stringify(error, null, 2));
    }
    
    if (error.message && error.message.includes("Invalid API key")) {
      console.error("🚨 [Resend] API key is invalid");
      errorMessage = "Invalid API key - check RESEND_API_KEY in .env";
    }
    if (error.message && error.message.includes("Unauthorized")) {
      console.error("🚨 [Resend] API key is invalid or unauthorized");
      errorMessage = "Unauthorized - check RESEND_API_KEY in .env";
    }
    if (error.message && (error.message.includes("Not authorized to send emails from") || error.message.includes("gmail.com"))) {
      console.error("🚨 [Resend] Gmail/free email provider detected - Resend doesn't allow sending from free email providers");
      console.error("🚨 [Resend] Please set EMAIL_FROM to onboarding@resend.dev or a verified domain email");
      errorMessage = "Resend doesn't allow sending from Gmail/free email providers. Use onboarding@resend.dev or verify a domain.";
    }
    if (error.message && (error.message.includes("Domain") || error.message.includes("not verified"))) {
      console.error("🚨 [Resend] Domain issue - check sender email is verified");
      errorMessage = "Domain not verified - check EMAIL_FROM domain in Resend dashboard";
    }
    if (error.message && error.message.includes("testing emails")) {
      console.error("🚨 [Resend] Can only send to account owner email without domain verification");
      errorMessage = "Can only send to account owner email without domain verification";
    }

    return { success: false, error: errorMessage };
  }
};

module.exports = { sendNotificationEmail };
