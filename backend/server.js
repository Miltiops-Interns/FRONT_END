// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect MongoDB with better error handling
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-app";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Test email endpoint
app.get("/api/test-email", async (req, res) => {
  try {
    const { sendNotificationEmail } = require("./utils/emailService");
    console.log('🧪 Testing email from production...');
    
    const result = await sendNotificationEmail('contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      message: 'This is a test email from production backend'
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully!',
        messageId: result.messageId 
      });
    } else {
      res.json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Routes (unchanged)
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

// Protected route
const verifyToken = require("./middleware/verifyToken");
app.get("/api/secret", verifyToken, (req, res) => {
  res.json({ message: "This is protected data. You made it 🔒" });
});

// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));