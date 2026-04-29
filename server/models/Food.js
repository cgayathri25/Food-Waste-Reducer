const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Dairy, Veggies, Cooked
  quantity: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  isExpired: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);