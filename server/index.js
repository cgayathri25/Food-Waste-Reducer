const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin Initialized");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 

dotenv.config();
const app = express();

// 1. GLOBAL MIDDLEWARE
// origin: true allows the server to accept requests from whatever port your frontend is on
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json()); 

// 2. REQUEST LOGGER (Crucial for VIVA debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// 3. DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// 4. API ROUTE REGISTRATION (Moved ABOVE the root '/' route)
app.use('/api/share', require('./routes/share'));
app.use('/api/inventory', require('./routes/inventory')); 
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/meals', require('./routes/meals'));

// 5. AUTHENTICATION ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, authMethod: 'manual' });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login." });
  }
});

app.post('/api/auth/google-sync', async (req, res) => {
  try {
    const { googleId, name, email, avatar } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      user.googleId = googleId;
      user.avatar = avatar;
      await user.save();
    } else {
      user = new User({ googleId, name, email, avatar, authMethod: 'google' });
      await user.save();
    }
    res.status(200).json({ message: "Google sync successful", user });
  } catch (err) {
    res.status(500).json({ message: "Google sync failed" });
  }
});

// 6. CATCH-ALL ROOT ROUTE (Moved to the end)
app.get('/', (req, res) => { 
  res.send('Food Waste Reducer API is running...'); 
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});