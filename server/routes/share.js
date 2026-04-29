const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem'); 

// 1. GET: Fetch all shared food items
// UPDATED: Now populates the requester's name and email from the User collection
router.get('/all', async (req, res) => {
  try {
    const listings = await FoodItem.find()
      .populate('requester', 'name email') // This pulls User details into the 'requester' field
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Add a new food listing
router.post('/add', async (req, res) => {
  const listing = new FoodItem(req.body);
  try {
    const saved = await listing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT: Request / Claim an item
router.put('/request/:id', async (req, res) => {
  try {
    const { requesterId } = req.body; 
    
    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Claimed', 
        requester: requesterId 
      },
      { new: true } 
    ).populate('requester', 'name email'); // Populate here too so the immediate response has the name

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ 
      message: "Item requested successfully!", 
      item: updatedItem 
    });
  } catch (err) {
    console.error("Request Error:", err);
    res.status(500).json({ message: "Error requesting item", error: err.message });
  }
});

module.exports = router;