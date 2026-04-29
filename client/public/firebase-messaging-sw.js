importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBEpOhDEaX7AnndB661g8j3ED2qZjn0euA",
  authDomain: "food-waste-reducer-6fe60.firebaseapp.com",
  projectId: "food-waste-reducer-6fe60",
  storageBucket: "food-waste-reducer-6fe60.appspot.com",
  messagingSenderId: "259324202513",
  appId: "1:259324202513:web:e7ef958bf6b25c6933abb0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Food Waste Alert';
  const notificationOptions = {
    body: payload.notification.body || 'Check your inventory for expiring items!',
    // Since your app icon is a plant emoji, ensure you have a 'plant.png' 
    // or similar in your /public folder. 
    icon: '/plant.png', 
    badge: '/plant.png' // This shows in the status bar on mobile
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});