const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// API endpoint to receive contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
