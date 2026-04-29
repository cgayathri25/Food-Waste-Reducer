const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  itemName: { type: String, required: true },
  category: { type: String, default: 'Other' },
  expiryDate: { type: Date, required: true },
  quantity: { type: String },
  status: { 
    type: String, 
    enum: ['Fresh', 'Expiring Soon', 'Expired'], 
    default: 'Fresh' 
  }
}, { timestamps: true });


module.exports = mongoose.model('Inventory', InventorySchema, 'inventory');
