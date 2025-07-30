const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant-app');

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);


//  1. Import verifyToken middleware
const verifyToken = require('./middleware/verifyToken');

//  2. Add a protected route
app.get('/api/secret', verifyToken, (req, res) => {
  res.json({ message: "This is protected data. You made it 🔒" });
});

// Listen
app.listen(5000, () => console.log('Backend running on port 5000'));
