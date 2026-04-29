const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');

// Get the weekly meal plan
router.get('/all', async (req, res) => {
  try {
    const plans = await MealPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;