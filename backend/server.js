// backend/server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

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
console.log("  EMAIL_HOST:", process.env.EMAIL_HOST || "[MISSING]");
console.log("  EMAIL_PORT:", process.env.EMAIL_PORT || "[MISSING]");
console.log("  EMAIL_USER:", process.env.EMAIL_USER ? "[SET]" : "[MISSING]");
console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "[SET]" : "[MISSING]");
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
    EMAIL_HOST: process.env.EMAIL_HOST || "[MISSING]",
    EMAIL_PORT: process.env.EMAIL_PORT || "[MISSING]",
    EMAIL_USER: process.env.EMAIL_USER ? "[SET]" : "[MISSING]",
    EMAIL_PASS: process.env.EMAIL_PASS ? "[SET]" : "[MISSING]",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "[MISSING]",
    DEBUG_EMAIL: process.env.DEBUG_EMAIL || "[NOT SET]",
  };
  console.log("🔍 [Test] Environment check result:", envCheck);
  res.json({ status: "Environment variables check", data: envCheck });
});

// Test SMTP connection
app.get("/test-smtp", async (req, res) => {
  try {
    console.log("🔍 [Test] SMTP connection test requested");
    console.log("🔍 [Test] SMTP config:");
    console.log("  Host:", process.env.EMAIL_HOST);
    console.log("  Port:", process.env.EMAIL_PORT);
    console.log(
      "  User:",
      process.env.EMAIL_USER
        ? `${process.env.EMAIL_USER.slice(0, 3)}****`
        : "[MISSING]"
    );
    console.log("  Pass:", process.env.EMAIL_PASS ? "[SET]" : "[MISSING]");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ [Test] SMTP verified successfully");
    res.json({
      status: "success",
      message: "SMTP connection successful",
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
      },
    });
  } catch (err) {
    console.error("❌ [Test] SMTP Error:", err);
    console.error("❌ [Test] Error details:", {
      message: err.message,
      code: err.code,
      response: err.response,
      command: err.command,
    });
    res.status(500).json({
      status: "error",
      message: "SMTP failed: " + err.message,
      error: {
        message: err.message,
        code: err.code,
        response: err.response,
      },
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
  console.log("  GET  /test-smtp - Test SMTP connection");
  console.log("  POST /api/contact - Contact form submission");
  console.log("  POST /api/reservations - Reservation submission");
  console.log("  POST /api/orders - Order submission");
  console.log("  GET  /api/menu - Get menu items");
  console.log("  POST /api/auth/login - Admin login");
  console.log("🚀 [Server] Ready to handle requests!");
});
