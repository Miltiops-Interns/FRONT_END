const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/verifyToken");

// POST /api/orders - public: submit a new order
router.post("/", async (req, res) => {
  try {
    const { customerName, phone, whatsapp, items, totalPrice } = req.body;

    if (
      !customerName ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or empty items" });
    }

    const sanitizedItems = items.map((i) => ({
      id: String(i.id),
      name: String(i.name),
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      image: i.image ? String(i.image) : undefined,
    }));

    const order = new Order({
      customerName,
      phone,
      whatsapp: whatsapp || "",
      items: sanitizedItems,
      totalPrice: Number(totalPrice) || 0,
    });

    await order.save();
    return res.status(201).json({ message: "Order received", id: order._id });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /api/orders - admin only: list orders
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/count - admin only: count orders
router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching order count:", err);
    res.status(500).json({ error: "Failed to fetch order count" });
  }
});

// PUT /api/orders/:id - admin only: update status
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "processing", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
