import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging"; // ADDED for FCM

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEpOhDEaX7AnndB661g8j3ED2qZjn0euA",
  authDomain: "food-waste-reducer-6fe60.firebaseapp.com",
  projectId: "food-waste-reducer-6fe60",
  storageBucket: "food-waste-reducer-6fe60.firebasestorage.app",
  messagingSenderId: "259324202513",
  appId: "1:259324202513:web:e7ef958bf6b25c6933abb0",
  measurementId: "G-FMT9Y2EQ84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const messaging = getMessaging(app); // ADDED: Export messaging service

/**
 * ADDED: Function to request notification permission and get the FCM token.
 * During your VIVA, you can explain that this is the "handshake" between 
 * the browser and Firebase to allow push alerts.
 */
export const requestForToken = (userId) => {
  return getToken(messaging, { 
    // You get this VAPID key from Firebase Console > Project Settings > Cloud Messaging
    vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' 
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log('FCM Token generated:', currentToken);
        // Save this token to your backend User model
        return fetch(`http://localhost:8000/api/users/update-fcm-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, fcmToken: currentToken })
        });
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};