const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  foodName: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: String, 
    required: true 
  },
  donor: { 
    type: String, 
    required: true 
  },
  expiry: { 
    type: String, 
    required: true 
  },
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  // These two fields are critical for the "Request" button logic
  status: { 
    type: String, 
    default: 'Available' 
  },
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  }
}, { timestamps: true });

// We add 'fooditems' as the third argument to FORCE the collection name
module.exports = mongoose.model('FoodItem', FoodItemSchema, 'fooditems');