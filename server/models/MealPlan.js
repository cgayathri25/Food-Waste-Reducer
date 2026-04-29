const mongoose = require('mongoose');
const mealPlanSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday"
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String
  }
}, { timestamps: true });
module.exports = mongoose.model('MealPlan', mealPlanSchema);