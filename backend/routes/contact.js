const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const { sendNotificationEmail } = require("../utils/emailService");

// POST - Submit contact form
router.post("/", async (req, res) => {
  try {
    console.log("🔍 [Contact] Received contact form submission");
    console.log("🔍 [Contact] Request body keys:", Object.keys(req.body || {}));

    const { name, email, phone, message } = req.body;
    console.log("🔍 [Contact] Extracted data:");
    console.log("  Name:", name || "[MISSING]");
    console.log("  Email:", email || "[MISSING]");
    console.log("  Phone:", phone || "[NOT PROVIDED]");
    console.log(
      "  Message:",
      message ? `${message.slice(0, 50)}...` : "[MISSING]"
    );

    // Validate required fields
    if (!name || !email || !message) {
      console.error("❌ [Contact] Validation failed - missing required fields");
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    // Create new contact message
    console.log("🔍 [Contact] Creating contact message in database...");
    const newMessage = new ContactMessage({
      name,
      email,
      phone: phone || "",
      message,
    });

    // Save to database
    await newMessage.save();
    console.log(
      "✅ [Contact] Message saved to database with ID:",
      newMessage._id
    );

    // Send notification email to admin (don't wait for it)
    console.log("🔍 [Contact] Attempting to send notification email...");
    sendNotificationEmail("contact", {
      name,
      email,
      phone: phone || "",
      message,
    })
      .then((result) => {
        if (result.success) {
          console.log("✅ [Contact] Notification email sent successfully");
        } else {
          console.error(
            "❌ [Contact] Notification email failed:",
            result.error
          );
        }
      })
      .catch((err) => {
        console.error("❌ [Contact] Notification email error:", err);
      });

    console.log("✅ [Contact] Contact form processed successfully");
    res.status(201).json({
      message: "Message sent successfully",
      id: newMessage._id,
    });
  } catch (err) {
    console.error("❌ [Contact] Error processing contact form:");
    console.error("  Error message:", err.message || "Unknown error");
    console.error("  Error stack:", err.stack || "No stack trace");
    console.error("  Full error:", err);
    res.status(500).json({
      error: "Failed to send message. Please try again.",
    });
  }
});

module.exports = router;
