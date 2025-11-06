const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true }, // Price before GST
    cgst: { type: Number, required: true, default: 0 }, // CGST amount (2.5%)
    sgst: { type: Number, required: true, default: 0 }, // SGST/UTGST amount (2.5%)
    totalPrice: { type: Number, required: true }, // Total including GST
    status: {
      type: String,
      enum: ["new", "processing", "completed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
