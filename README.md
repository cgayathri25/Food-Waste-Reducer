Food Waste Reducer & Community Sharing Platform
A full-stack MERN application designed to reduce domestic food waste through intelligent inventory tracking, automated expiry notifications, and a peer-to-peer community sharing marketplace.

Features
Inventory Management: Track personal food stocks with categories and expiry dates.

Automated Alerts: Real-time push notifications via Firebase Cloud Messaging (FCM) when items are near expiry.

Community Share: A marketplace to list and claim surplus food from other users.

Hybrid Authentication: Secure manual login (Bcrypt) and Google OAuth integration.

Meal Planner: Weekly meal scheduling to optimize food usage.

Tech Stack
Frontend: React 18, Vite, Tailwind CSS, Lucide Icons.

Backend: Node.js, Express.js, Node-Cron (for automated tasks).

Database: MongoDB Atlas (Mongoose ODM).

Cloud/Auth: Firebase (Authentication & Cloud Messaging).

Installation and Setup
1. Clone the Repository

Bash
git clone https://github.com/your-username/food-waste-reducer.git
cd food-waste-reducer
2. Backend Configuration

Navigate to the server directory and install dependencies:

Bash
cd server
npm install
Create a .env file in the server folder using the following template:

Plaintext
PORT=8000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/foodwaste_db?retryWrites=true&w=majority
Firebase Admin Setup:
Place your firebase-adminsdk.json file in the server/ directory. This file is required for the backend to send push notifications. You can generate this in the Firebase Console under Project Settings > Service Accounts.

3. Frontend Configuration

Navigate to the client directory and install dependencies:

Bash
cd ../client
npm install
Firebase Client Setup:
Ensure your src/firebase-config.js file contains your specific web app configuration:

JavaScript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
4. Running the Application

Start the Backend:

Bash
cd server
npm run dev
Start the Frontend:

Bash
cd client
npm run dev
Testing the Notification Engine
To demonstrate the automated expiry alerts during evaluation without waiting for the daily scheduled Cron job:

Ensure browser notifications are allowed for http://localhost:5173.

Visit the manual trigger endpoint: http://localhost:8000/api/notifications/trigger-now

This will immediately scan the database for items expiring within 48 hours and dispatch push notifications to the registered device tokens.

Security Best Practices
Passwords: User passwords for manual accounts are encrypted using bcryptjs with a salt factor of 10.

Environment Variables: Sensitive database URIs and private keys are managed via .env and service account JSONs, which are excluded from version control via .gitignore.

Identity Management: OAuth 2.0 is utilized for Google Sign-In to ensure secure, token-based authentication. 