import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
// --- ADDED FIREBASE IMPORTS ---
import { auth, provider } from "../firebase"; // Ensure this path matches your project
import { signInWithPopup } from "firebase/auth";

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  .login-wrap {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative;
    background: linear-gradient(135deg, #f0f9f6, #e8f5e9, #ffffff);
    background-size: 400% 400%;
    animation: bgMove 15s ease infinite;
    transition: background 0.6s ease;
  }
  .login-wrap.dark {
    background: linear-gradient(135deg, #0d1a14, #1b3327, #0a110d);
  }
  @keyframes bgMove {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  .login-float {
    position: absolute; top: 100%; font-size: 32px;
    opacity: 0.4; animation: floatUp 12s linear infinite;
    z-index: 0; pointer-events: none; user-select: none;
  }
  .login-float:nth-child(1) { left: 5%; }
  .login-float:nth-child(2) { left: 35%; animation-delay: 4s; }
  .login-float:nth-child(3) { left: 65%; animation-delay: 2s; }
  .login-float:nth-child(4) { left: 85%; animation-delay: 6s; }
  @keyframes floatUp {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
    10%  { opacity: 0.4; }
    90%  { opacity: 0.4; }
    100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
  }

  .login-theme-btn {
    position: fixed; top: 25px; right: 25px;
    background: white; width: 50px; height: 50px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 200;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
    border: none; font-size: 1.4rem; transition: transform .2s;
  }

  .login-card {
    position: relative; z-index: 10;
    width: 95%; max-width: 420px;
    padding: 50px 36px;
    border-radius: 28px;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(45,138,93,.1);
    text-align: center;
    box-shadow: 0 16px 40px rgba(0,0,0,.07);
    transition: background .5s, box-shadow .5s;
  }
  .login-wrap.dark .login-card {
    background: rgba(20,32,26,.88);
    border: 1px solid rgba(255,255,255,.06);
    box-shadow: 0 28px 56px rgba(0,0,0,.45);
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 900; margin-bottom: 8px;
    background: linear-gradient(90deg, #2d8a5d, #66bb6a, #2d8a5d);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradShift 4s linear infinite;
    background-size: 200% auto;
  }
  @keyframes gradShift { 100% { background-position: 200% center; } }

  .login-sub { color: #607d6e; font-size: .88rem; margin-bottom: 34px; font-weight: 500; }

  .login-input {
    width: 100%; padding: 15px 16px; margin-bottom: 14px;
    border-radius: 12px; border: 1.5px solid #e2e8f0;
    background: #fff; outline: none;
    font-family: 'Outfit', sans-serif; font-size: .96rem; color: #1e293b;
    box-sizing: border-box;
  }
  .login-input:focus { border-color: #2d8a5d; box-shadow: 0 0 0 3px rgba(45,138,93,.12); }

  .login-divider {
    margin: 22px 0; display: flex; align-items: center;
    color: #94a3b8; font-size: .78rem; font-weight: 600;
  }
  .login-divider::before, .login-divider::after {
    content: ""; flex: 1; height: 1px; background: #e2e8f0; margin: 0 12px;
  }

  .login-google-btn {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #fff; color: #1e293b;
    font-family: 'Outfit', sans-serif; font-size: .92rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all .2s;
  }
  .login-google-btn:hover { border-color: #94a3b8; box-shadow: 0 4px 14px rgba(0,0,0,.1); }

  .login-btn {
    width: 100%; padding: 15px; border: none; border-radius: 12px;
    background: #2d8a5d; color: #fff;
    font-family: 'Outfit', sans-serif; font-size: .98rem; font-weight: 700;
    cursor: pointer; transition: all .25s;
    box-shadow: 0 6px 20px rgba(45,138,93,.3);
  }
  .login-btn:hover { background: #1b5e20; transform: translateY(-2px); }

  .login-success {
    position: absolute; inset: 0; z-index: 20; border-radius: 28px;
    background: rgba(220,252,231,.96);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  }
`;

const GOOGLE_SVG = (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.2l7.8 6C13 13.7 18 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
    <path fill="#FBBC05" d="M11 28.8A14.5 14.5 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.5-6z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6 0-11-4-12.8-9.5l-8.5 6C7 43.4 14.8 48 24 48z"/>
  </svg>
);

export default function Login() {
  const [dark, setDark] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const styleId = "login-styles-unique";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.textContent = LOGIN_CSS;
      document.head.appendChild(styleTag);
    }
    return () => { if (styleTag) styleTag.remove(); };
  }, []);

  const handleAuth = async (initial, googleData = null) => {
    try {
      let userData;
      if (googleData) {
        // ACTUAL GOOGLE HANDSHAKE
        const res = await axios.post('http://localhost:8000/api/auth/google-sync', {
          googleId: googleData.uid,
          name: googleData.displayName,
          email: googleData.email,
          avatar: googleData.photoURL
        });
        userData = res.data.user;
      } else {
        // MANUAL LOGIN HANDSHAKE
        const res = await axios.post('http://localhost:8000/api/auth/login', { email, password });
        userData = res.data.user;
      }

      // Save critical session data
      localStorage.setItem("dbUserId", userData.id);
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userInitial", initial);
      localStorage.setItem("userName", userData.name); 
      
      setSuccess(true);
      setTimeout(() => { navigate("/home"); }, 1800);
    } catch (err) {
      console.error("Auth sync failed", err);
      // Detailed error alert to help you see what Port 8000 is saying
      alert(err.response?.data?.message || "Login failed. Check if Port 8000 is running.");
    }
  };

  // --- TRIGGER GOOGLE AUTH FLOW ---
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      handleAuth(result.user.displayName.charAt(0), result.user);
    } catch (error) {
      console.error("Firebase Auth Error", error);
    }
  };

  return (
    <div className={`login-wrap ${dark ? 'dark' : ''}`}>
      {["🍎","🥦","🥕","🍐"].map((f, i) => (
        <div key={i} className="login-float">{f}</div>
      ))}

      <button className="login-theme-btn" onClick={() => setDark(!dark)}>
        {dark ? "🍱" : "🌿"}
      </button>

      <div className="login-card">
        {success && (
          <div className="login-success">
            <div style={{fontSize: '3rem'}}>🎉</div>
            <h2 style={{color: '#166534'}}>Welcome back!</h2>
            <p>Entering your kitchen...</p>
          </div>
        )}

        <h1 className="login-title">Food Waste Reducer</h1>
        <p className="login-sub">Save food · Save planet · Save money</p>

        <form onSubmit={(e) => { e.preventDefault(); handleAuth(email.charAt(0).toUpperCase()); }}>
          <input 
            className="login-input" type="email" placeholder="Email Address" 
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            className="login-input" type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button className="login-btn" type="submit">Sign In</button>
        </form>

        <div className="login-divider">OR</div>

        <button className="login-google-btn" type="button" onClick={handleGoogleSignIn}>
          {GOOGLE_SVG}
          Continue with Google
        </button>

        <div style={{marginTop: '25px', fontSize: '.84rem', color: '#78909c'}}>
          No account? <Link to="/register" style={{color: '#2d8a5d', fontWeight: 700, textDecoration: 'none'}}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}