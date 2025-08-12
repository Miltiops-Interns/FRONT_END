const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const verifyToken = require("../middleware/verifyToken");

// GET - Fetch all contact messages (protected route)
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 }) // Most recent first
      .select("-__v"); // Exclude version key

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
});

// DELETE - Delete a specific message (protected route)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({
      error: "Failed to delete message",
    });
  }
});

// GET - Get message count for dashboard (protected route)
router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error counting messages:", err);
    res.status(500).json({
      error: "Failed to count messages",
    });
  }
});

module.exports = router;
