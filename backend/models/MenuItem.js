const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // 🔥 image URL field
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
