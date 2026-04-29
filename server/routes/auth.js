const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. REGISTER a new user (Manual)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { id: newUser._id, name, email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN user (Manual)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return the _id so the frontend can link it to Listings
    res.json({ 
      message: "Login successful!", 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GOOGLE SYNC (Level 2 Integration)
// This route handles users logging in via Google OAuth
router.post('/google-sync', async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    // Use findOneAndUpdate with upsert:true 
    // This finds the user by email/googleId or creates them if they don't exist
    const user = await User.findOneAndUpdate(
      { email }, 
      { name, googleId, avatar }, 
      { upsert: true, new: true }
    );

    res.json({
      message: "Google sync successful!",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;