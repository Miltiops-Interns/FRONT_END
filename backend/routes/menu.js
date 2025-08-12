const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const verifyToken = require('../middleware/verifyToken');

// GET all menu items
router.get('/', async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// POST create new item (admin only)
router.post('/', verifyToken, async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.json(newItem);
});

// PUT update item
router.put('/:id', verifyToken, async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


// DELETE item
router.delete('/:id', verifyToken, async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
