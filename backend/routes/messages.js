const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const verifyToken = require("../middleware/verifyToken");

// Public reviews endpoint returning static testimonials for homepage
// This avoids 404/HTML responses when frontend expects JSON at /api/reviews
router.get("/reviews", (_req, res) => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      comment:
        "The best Punjabi food I've ever had! The butter chicken is to die for.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Michael Chen",
      comment:
        "Authentic flavors and amazing service. A must-visit restaurant!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Priya Patel",
      comment:
        "Feels like home! The spices and aromas are exactly like my grandmother's cooking.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];
  res.json(testimonials);
});

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
