const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const admin = require('firebase-admin'); // Changed from nodemailer
const Inventory = require('../models/Inventory');
const User = require('../models/User');

// 1. Initialize Firebase Admin SDK
// Ensure firebase-adminsdk.json is in your server folder
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// --- NEW: Route to save FCM Token from Frontend ---
router.post('/save-token', async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) {
      return res.status(400).json({ error: "UserId and Token are required" });
    }

    // Update the user document with the new FCM token
    await User.findByIdAndUpdate(userId, { fcmToken: token });
    
    console.log(`FCM Token saved for user: ${userId}`);
    res.status(200).json({ message: "Token saved successfully" });
  } catch (err) {
    console.error("Error saving token:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. The Expiry Check Logic (Updated for Firebase Cloud Messaging)
const checkExpirations = async () => {
  console.log("Running Expiry Check...");
  
  try {
    const now = new Date();
    // Set to 00:00:00 of today to catch everything that expires on this date
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    
    const twoDaysFromNow = new Date(startOfToday);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    // Find items expiring between start of today and 2 days from now
    const expiringItems = await Inventory.find({
      expiryDate: { 
        $gte: startOfToday, 
        $lte: twoDaysFromNow 
      }
    }).populate('userId');

    // Group items by user to send targeted push notifications
    const userAlerts = {};
    expiringItems.forEach(item => {
      if (item.userId && item.userId.fcmToken) {
        const token = item.userId.fcmToken;
        if (!userAlerts[token]) userAlerts[token] = [];
        userAlerts[token].push(item.itemName);
      }
    });

    // Send the Push Notifications via Firebase
    for (const [token, items] of Object.entries(userAlerts)) {
      const message = {
        notification: {
          title: 'Food Expiry Alert!',
          body: `Items expiring soon: ${items.join(', ')}. Use them soon!`
        },
        token: token
      };

      await admin.messaging().send(message);
      console.log(`Push notification sent to token starting with: ${token.substring(0, 10)}...`);
    }
  } catch (err) {
    console.error("FCM Alert Error:", err);
  }
};

// 3. Schedule the task (Runs every day at 9:00 AM)
cron.schedule('0 9 * * *', checkExpirations);

// 4. Manual Trigger Route (For your VIVA Demo)
router.get('/trigger-now', async (req, res) => {
  console.log("!!! Manual Trigger Route Hit !!!");
  await checkExpirations();
  res.json({ message: "Expiry check triggered and FCM notifications sent!" });
});

module.exports = router;