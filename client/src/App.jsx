import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all components from the components folder
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import FoodShare from './components/FoodShare';
import Login from './components/Login';
import MealPlanner from './components/MealPlanner';
import Alerts from './components/Alerts';
import Register from './components/Register';
import HowItWorks from './components/HowItWorks';
import Tips from './components/Tips'; // 1. IMPORTED TIPS COMPONENT

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. STARTING POINT: The Login Page */}
        <Route path="/" element={<Login />} />
        
        {/* Explicit /login route for navigation consistency */}
        <Route path="/login" element={<Login />} />
        
        {/* 2. SECOND STAGE: The Welcome/Hero Page */}
        <Route path="/home" element={<Home />} />
        
        {/* 3. FUNCTIONAL PAGES: The Tools */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        
        {/* This path matches the 'Meals' link in your Nav Bar */}
        <Route path="/meals" element={<MealPlanner />} />
        
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/food-share" element={<FoodShare />} />
        
        {/* 4. EDUCATIONAL & INSTRUCTIONAL PAGES */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/tips" element={<Tips />} /> {/* 2. ADDED TIPS ROUTE */}
        
        {/* Registration */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;