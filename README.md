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

System Design and Architecture : 

The Food Waste Reducer is engineered using a modern Three-Tier MERN Stack architecture, ensuring a clear separation of concerns between the user interface, business logic, and data persistence layers.

Architectural Model: Three-Tier Structure

This project follows the traditional Three-Tier model to enhance scalability and maintainability:

Presentation Tier (Frontend): Developed with React.js, this layer manages the user experience, client-side routing, and responsive UI components.

Application Tier (Backend): Powered by Node.js and Express.js, this layer handles the core business logic, including authentication protocols and the expiry calculation engine.

Data Tier (Database): Utilizing MongoDB Atlas, this NoSQL cloud database ensures persistent and secure storage for user profiles and inventory records.

Design Patterns and Models : 

Model-View-Controller (MVC) : 

The backend is structured according to the MVC design pattern to maintain organizational clarity:

Models: Mongoose schemas define the data structure and enforce validation rules within the MongoDB environment.

Controllers (Routes): Express routers act as controllers that receive HTTP requests from the frontend, interact with the models, and return structured JSON responses.

Views: The React-based frontend serves as the dynamic view layer that renders the processed data for the end-user.

RESTful API Design : 

Communication between the client and server is based on the REST (Representational State Transfer) model:

Stateless Communication: Each request from the client contains all the information needed for the server to fulfill it.

Standardized Methods: The application utilizes standard HTTP verbs including POST for authentication and item creation, GET for inventory retrieval, and DELETE for item removal.

Event-Driven Alert Architecture : 

A specialized Event-Driven model was implemented for the notification system to proactively prevent food waste:

Automated Scheduling: A Node-Cron background worker scans the database at set intervals to identify items nearing their expiration dates.

Push Notification Pipeline: The backend triggers events via Firebase Cloud Messaging (FCM) using project-specific VAPID keys.

Background Processing: A dedicated Service Worker remains active in the browser background to catch push events and display alerts even when the application tab is closed.

Authentication and Identity Model : 

The project employs a Hybrid Identity Management model:

Manual Authentication: Local registration and login utilizing server-side password hashing.

Federated Identity: Integration with Google OAuth 2.0 via Firebase, allowing users to sign in with existing accounts.

Identity Synchronization: A custom google-sync route ensures that external identity data is correctly mapped and stored within the local MongoDB environment.

Team Contributions : 

1. C.Gayathri : Login & Authentication, MongoDB Atlas integration and schema, Cron-job Alerts, SOW, Test Plan
2. Siddanth G : Frontend 
3. Aasish G : Community Food Sharing
4. Tanishka Guha : Meal Planner
5. Monisha P : Storage tips, SRS
6. Varshith D : Dashboard, SDS
7. Rutwik K : Storage tips, SRS, SDS
8. Pranathi G : Storage tips (Only assisted)
