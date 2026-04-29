// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// ADDED: Import for Firebase Messaging
import { getMessaging } from "firebase/messaging"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// ADDED: Initialize and Export Messaging for Push Notifications
export const messaging = getMessaging(app);