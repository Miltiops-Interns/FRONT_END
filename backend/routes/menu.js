const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const verifyToken = require('../middleware/verifyToken');

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// POST create new item (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Clean and validate price - remove "/-" and convert to number
    let price = req.body.price;
    if (typeof price === 'string') {
      // Remove "/-", spaces, and any non-numeric characters except decimal point
      price = price.replace(/[^\d.]/g, '');
      price = parseFloat(price);
    }
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid price. Please enter a valid number." });
    }

    const newItem = new MenuItem({
      ...req.body,
      price: price
    });
    
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Error creating menu item:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PUT update item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Clean and validate price if provided
    if (req.body.price !== undefined) {
      let price = req.body.price;
      if (typeof price === 'string') {
        price = price.replace(/[^\d.]/g, '');
        price = parseFloat(price);
      }
      
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Invalid price. Please enter a valid number." });
      }
      req.body.price = price;
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating menu item:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = router;
