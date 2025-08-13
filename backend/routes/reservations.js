const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const verifyToken = require("../middleware/verifyToken");

// POST - Submit reservation form (public route)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        error: "Name, email, phone, date, time, and guests are required",
      });
    }

    // Create new reservation
    const newReservation = new Reservation({
      name,
      email,
      phone,
      date: new Date(date),
      time,
      guests: parseInt(guests),
      specialRequests: specialRequests || "",
    });

    // Save to database
    await newReservation.save();

    res.status(201).json({
      message: "Reservation submitted successfully",
      id: newReservation._id,
    });
  } catch (err) {
    console.error("Error saving reservation:", err);
    res.status(500).json({
      error: "Failed to submit reservation. Please try again.",
    });
  }
});

// GET - Get all reservations (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({
      error: "Failed to fetch reservations",
    });
  }
});

// GET - Get reservation count (admin only)
router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await Reservation.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching reservation count:", err);
    res.status(500).json({
      error: "Failed to fetch reservation count",
    });
  }
});

// PUT - Update reservation status (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    res.json(updatedReservation);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({
      error: "Failed to update reservation",
    });
  }
});

// DELETE - Delete reservation (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({
      error: "Failed to delete reservation",
    });
  }
});

module.exports = router;
