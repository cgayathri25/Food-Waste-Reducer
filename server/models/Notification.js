const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // alert, success, info
  read: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);