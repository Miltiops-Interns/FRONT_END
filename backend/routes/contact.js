const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST - Submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    // Create new contact message
    const newMessage = new ContactMessage({
      name,
      email,
      phone: phone || "",
      message,
    });

    // Save to database
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      id: newMessage._id,
    });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({
      error: "Failed to send message. Please try again.",
    });
  }
});

module.exports = router;
