// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-app";
mongoose.connect(mongoUri);

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