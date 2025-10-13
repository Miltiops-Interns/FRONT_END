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

/* 🧠 Log important env variables (safe ones) to confirm Render is reading them */
console.log("📬 EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("📬 EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("📬 EMAIL_USER:", process.env.EMAIL_USER ? "[SET]" : "[MISSING]");
console.log("📬 ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("🪙 MONGO_URI set:", Boolean(process.env.MONGO_URI));

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
// 📤 Test SMTP Endpoint (for debugging Render SMTP)
// =======================
app.get("/test-smtp", async (req, res) => {
  try {
    console.log("Testing SMTP connection...");

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
    console.log("✅ SMTP verified successfully");
    res.send("✅ SMTP connection successful");
  } catch (err) {
    console.error("❌ SMTP Error:", err);
    res.status(500).send("❌ SMTP failed: " + err.message);
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
  console.log(`🚀 Backend running on http://${host}:${port}`);
});
