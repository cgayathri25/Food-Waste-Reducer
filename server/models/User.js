const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
    trim: true
  },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } 
  },
  googleId: { 
    type: String, 
    unique: true,
    sparse: true 
  },
  avatar: { 
    type: String 
  },
  authMethod: { 
    type: String,
    enum: ['manual', 'google'],
    default: 'manual'
  },
  role: { 
    type: String, 
    enum: ['donor', 'recipient', 'admin'], 
    default: 'donor' 
  },
  // ADDED for Firebase Cloud Messaging (FCM)
  // This stores the unique device token needed to send push notifications
  fcmToken: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);