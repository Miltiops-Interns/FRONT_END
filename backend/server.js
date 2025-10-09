// backend/server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
const fallbackMongoUri =
  "mongodb+srv://divyantwal049:Abhi%40049@hotelwebsite.gtvkgnb.mongodb.net/?retryWrites=true&w=majority&appName=hotelwebsite";
const usingEnvMongoUri = Boolean(process.env.MONGO_URI);
const mongoUri = usingEnvMongoUri ? process.env.MONGO_URI : fallbackMongoUri;

// Guard against malformed URIs copied from Atlas with angle brackets or un-encoded passwords
let effectiveMongoUri = mongoUri;
if (/[<>]/.test(mongoUri)) {
  console.warn(
    "Invalid MONGO_URI detected (angle brackets present). Falling back to encoded default. Please fix backend/.env (encode @ as %40)."
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
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
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
