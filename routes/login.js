// routes/login.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// const Client = require('../models/Client'); // Import Client model


// const clientSchema = new mongoose.Schema({
//   fullname: { type: String, required: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// module.exports = mongoose.model('clients', clientSchema);

// Login API route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const client = await Client.findOne({ username });

    // Check if the user exists and if the password matches
    if (!client || client.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Respond with a success message or user data
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
