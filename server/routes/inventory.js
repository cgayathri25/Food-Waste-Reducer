const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// --- DEBUG ROUTE ---
router.get('/test', (req, res) => {
  res.json({ message: "Inventory route is working and reachable!" });
});

// 1. GET all items 
router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    //  DIAGNOSTIC LOG: This will tell us if the DB is actually finding your Grapes
    console.log("--- API REQUEST: Fetching all inventory items ---");
    
    const items = await Inventory.find().sort({ expiryDate: 1 });
    
    console.log(`--- DATABASE RESULT: Found ${items.length} items in 'inventory' collection ---`);
    if (items.length > 0) {
      console.log("First item found:", items[0].itemName);
    }

    if (!items) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(items);
  } catch (err) {
    console.error("GET All Inventory Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// 2. GET items for a specific user
router.get('/:userId', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    console.log("Fetching inventory for User ID:", req.params.userId);
    
    const items = await Inventory.find({ userId: req.params.userId }).sort({ expiryDate: 1 });
    res.json(items || []);
  } catch (err) {
    console.error("GET User Inventory Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. POST a new item
router.post('/add', async (req, res) => {
  try {
    console.log("Adding new item:", req.body);
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("POST Inventory Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE an item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found in database" });
    }
    res.json({ message: "Item removed from inventory" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
