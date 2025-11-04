// backend/server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ FIXED: removed custom .env path (Render doesn't use local .env file)
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 COMPREHENSIVE ENVIRONMENT VARIABLE LOGGING */
console.log("🔍 [Server Startup] Environment Variables Check:");
console.log("  NODE_ENV:", process.env.NODE_ENV || "[NOT SET]");
console.log("  PORT:", process.env.PORT || "[NOT SET - using default 5000]");
console.log("  HOST:", process.env.HOST || "[NOT SET - using default 0.0.0.0]");
console.log("  JWT_SECRET:", process.env.JWT_SECRET ? "[SET]" : "[MISSING]");
console.log("  MONGO_URI:", process.env.MONGO_URI ? "[SET]" : "[MISSING]");
console.log("  RESEND_API_KEY:", process.env.RESEND_API_KEY ? "[SET]" : "[MISSING - REQUIRED]");
console.log("  EMAIL_FROM:", process.env.EMAIL_FROM || "[MISSING]");
console.log("  ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "[MISSING]");
console.log("  DEBUG_EMAIL:", process.env.DEBUG_EMAIL || "[NOT SET]");

// =======================
// 🧭 MongoDB Connection
// =======================
const fallbackMongoUri =
  "mongodb+srv://divyantwal049:Abhi%40049@hotelwebsite.gtvkgnb.mongodb.net/?retryWrites=true&w=majority&appName=hotelwebsite";
const usingEnvMongoUri = Boolean(process.env.MONGO_URI);
const mongoUri = usingEnvMongoUri ? process.env.MONGO_URI : fallbackMongoUri;

let effectiveMongoUri = mongoUri;
if (/[<>]/.test(mongoUri)) {
  console.warn(
    "⚠️ Invalid MONGO_URI detected (angle brackets present). Falling back to encoded default. Please fix backend/.env (encode @ as %40)."
  );
  effectiveMongoUri = fallbackMongoUri;
}

const maskedUri = effectiveMongoUri
  .replace(/(mongodb\+srv:\/\/[^:]+:)[^@]*/, "$1****")
  .replace(/@.*/, "@<host-and-options-hidden>");

console.log(
  "Using MONGO_URI from env:",
  usingEnvMongoUri && effectiveMongoUri === mongoUri
);
console.log("Connecting to MongoDB with URI:", maskedUri);

mongoose
  .connect(effectiveMongoUri)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const conn = mongoose.connection;
    console.log(
      `Mongo connection details → host=${conn.host} port=${
        conn.port ?? "n/a"
      } db=${conn.name}`
    );
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// =======================
// 📤 Test Endpoints (for debugging Render)
// =======================

// Test environment variables
app.get("/test-env", (req, res) => {
  console.log("🔍 [Test] Environment variables check requested");
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || "[NOT SET]",
    PORT: process.env.PORT || "[NOT SET]",
    HOST: process.env.HOST || "[NOT SET]",
    JWT_SECRET: process.env.JWT_SECRET ? "[SET]" : "[MISSING]",
    MONGO_URI: process.env.MONGO_URI ? "[SET]" : "[MISSING]",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "[SET]" : "[MISSING - REQUIRED]",
    EMAIL_FROM: process.env.EMAIL_FROM || "[MISSING]",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "[MISSING]",
    DEBUG_EMAIL: process.env.DEBUG_EMAIL || "[NOT SET]",
  };
  console.log("🔍 [Test] Environment check result:", envCheck);
  res.json({ status: "Environment variables check", data: envCheck });
});

// Test Resend transactional email API (simple test)
app.get("/test-resend", async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_API_KEY.startsWith('re_')) {
      return res.status(400).json({
        status: "error",
        message: "RESEND_API_KEY (re_...) is not set or invalid",
      });
    }

    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const senderEmail = process.env.EMAIL_FROM || process.env.ADMIN_EMAIL;
    const toEmail = process.env.ADMIN_EMAIL;
    const subject = "Resend Test Email";
    // Simple plain text email to test basic functionality
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email from Restaurant App</h2>
          <p>This is a simple test email sent at ${new Date().toLocaleString()}</p>
          <p>If you receive this, Resend API is working correctly!</p>
        </body>
      </html>
    `;

    console.log("🔍 [Test Resend] Sending simple test email...");
    console.log("  From:", senderEmail);
    console.log("  To:", toEmail);
    
    const response = await resend.emails.send({
      from: senderEmail,
      to: toEmail,
      subject,
      html,
    });
    
    if (response.error) {
      console.error("❌ [Test Resend] Error in response:", response.error);
      throw new Error(response.error.message || JSON.stringify(response.error));
    }
    
    if (!response.data || !response.data.id) {
      console.error("❌ [Test Resend] Invalid response:", response);
      throw new Error("Resend returned invalid response");
    }
    
    console.log("✅ [Test Resend] Email accepted by API, ID:", response.data.id);
    console.log("⚠️  Note: Check Resend dashboard for delivery status");
    
    res.json({ 
      status: "success", 
      id: response.data.id,
      message: "Email accepted by Resend API. Check dashboard for delivery status."
    });
  } catch (err) {
    console.error("❌ [Test] Resend API Error:", err);
    res.status(500).json({
      status: "error",
      message: err && err.message ? err.message : String(err),
    });
  }
});

// Test email sending using the Resend API via emailService
app.get("/test-email", async (req, res) => {
  try {
    const { sendNotificationEmail } = require("./utils/emailService");
    
    const result = await sendNotificationEmail("contact", {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      message: "This is a test email to verify Resend API integration is working.",
    });

    if (result.success) {
      res.json({ 
        status: "success", 
        message: "Test email sent successfully via Resend API",
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({
        status: "error",
        message: result.error || "Failed to send email",
      });
    }
  } catch (err) {
    console.error("❌ [Test] Email Service Error:", err);
    res.status(500).json({
      status: "error",
      message: err && err.message ? err.message : String(err),
    });
  }
});

// =======================
// 🧭 Routes
// =======================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const menuRoutes = require("./routes/menu");
app.use("/api/menu", menuRoutes);

const contactRoutes = require("./routes/contact");
app.use("/api/contact", contactRoutes);

const messagesRoutes = require("./routes/messages");
app.use("/api/messages", messagesRoutes);

const reservationRoutes = require("./routes/reservations");
app.use("/api/reservations", reservationRoutes);

const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

const verifyToken = require("./middleware/verifyToken");
app.get("/api/secret", verifyToken, (req, res) => {
  res.json({ message: "This is protected data. You made it 🔒" });
});

// =======================
// 🚀 Start Server
// =======================
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log("🚀 [Server] Backend server started successfully!");
  console.log(`🚀 [Server] Running on http://${host}:${port}`);
  console.log(
    `🚀 [Server] Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log("🚀 [Server] Available endpoints:");
  console.log("  GET  /test-env - Test environment variables");
  console.log("  GET  /test-email - Test email sending via Resend API");
  console.log("  GET  /test-resend - Test Resend transactional API");
  console.log("  POST /api/contact - Contact form submission");
  console.log("  POST /api/reservations - Reservation submission");
  console.log("  POST /api/orders - Order submission");
  console.log("  GET  /api/menu - Get menu items");
  console.log("  POST /api/auth/login - Admin login");
  console.log("🚀 [Server] Ready to handle requests!");
});
