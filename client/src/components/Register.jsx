import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios'; 

const REGISTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  .reg-wrap {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative;
    background: linear-gradient(135deg, #f0f9f6, #e8f5e9, #ffffff);
    background-size: 400% 400%;
    animation: regBgMove 15s ease infinite;
  }
  .reg-wrap.dark { background: linear-gradient(135deg, #0d1a14, #1b3327, #0a110d); }
  
  @keyframes regBgMove {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  .reg-float {
    position: absolute; top: 100%; font-size: 32px;
    opacity: 0.4; animation: regFloatUp 12s linear infinite;
    z-index: 0; pointer-events: none;
  }
  @keyframes regFloatUp {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
    10%  { opacity: 0.4; }
    100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
  }

  .reg-theme-btn {
    position: fixed; top: 25px; right: 25px;
    background: white; width: 50px; height: 50px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 200; border: none; font-size: 1.4rem;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }

  .reg-card {
    position: relative; z-index: 10;
    width: 95%; max-width: 440px;
    padding: 48px 36px 40px; border-radius: 28px;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(45,138,93,.1);
    text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,.07);
  }

  .reg-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900; margin-bottom: 8px;
    background: linear-gradient(90deg, #2d8a5d, #66bb6a, #2d8a5d);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .reg-sub { color: #607d6e; font-size: .88rem; margin-bottom: 30px; font-weight: 500; }

  .reg-field { margin-bottom: 13px; text-align: left; }
  .reg-field-label { display: block; font-size: .72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; }
  
  .reg-input {
    width: 100%; padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; font-family: 'Outfit', sans-serif;
    font-size: .94rem; box-sizing: border-box; outline: none;
  }
  .reg-input:focus { border-color: #2d8a5d; box-shadow: 0 0 0 3px rgba(45,138,93,.12); }

  .reg-btn {
    width: 100%; padding: 15px; border: none; border-radius: 12px;
    background: #2d8a5d; color: #fff; font-weight: 700;
    cursor: pointer; transition: all .25s; margin-top: 10px;
    box-shadow: 0 6px 20px rgba(45,138,93,.3);
  }
  .reg-btn:hover { background: #1b5e20; transform: translateY(-2px); }

  .reg-success {
    position: absolute; inset: 0; z-index: 20; border-radius: 28px;
    background: rgba(220,252,231,.96);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
`;

export default function Register() {
  const [dark, setDark] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const styleId = "reg-styles";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.textContent = REGISTER_CSS;
      document.head.appendChild(styleTag);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pw !== confirm) { alert("Passwords do not match!"); return; }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        name,
        email,
        password: pw
      });

      if (response.status === 201) {
        setSuccess(true);
        
        // Wait 2 seconds so the user can see the "Account Created" animation
        setTimeout(() => {
          navigate("/login"); 
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={`reg-wrap${dark ? " dark" : ""}`}>
      {["🍎","🥦","🥕","🍐"].map((f, i) => (
        <div key={i} className="reg-float" style={{left: `${(i+1)*20}%`, animationDelay: `${i*2}s`}}>{f}</div>
      ))}

      <button className="reg-theme-btn" onClick={() => setDark(!dark)}>
        {dark ? "🍱" : "🌿"}
      </button>

      <div className="reg-card">
        {success && (
          <div className="reg-success">
            <div style={{fontSize: '3.5rem'}}>🌱</div>
            <h2 style={{color: '#166534'}}>Account Created!</h2>
            <p style={{color: '#166534'}}>Proceeding to login...</p>
          </div>
        )}

        <h1 className="reg-title">Join Us Today</h1>
        <p className="reg-sub">Create an account to start saving food</p>

        <form onSubmit={handleSubmit}>
          <div className="reg-field">
            <label className="reg-field-label">Full Name</label>
            <input className="reg-input" type="text" placeholder="Arjun Kumar" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="reg-field">
            <label className="reg-field-label">Email Address</label>
            <input className="reg-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="reg-field">
            <label className="reg-field-label">Password</label>
            <input className="reg-input" type="password" placeholder="Min. 6 characters" value={pw} onChange={e => setPw(e.target.value)} required />
          </div>

          <div className="reg-field">
            <label className="reg-field-label">Confirm Password</label>
            <input className="reg-input" type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>

          <button className="reg-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div style={{marginTop: '24px', fontSize: '.84rem', color: '#78909c'}}>
          Already have an account? <Link to="/login" style={{color: '#2d8a5d', fontWeight: 700, textDecoration: 'none'}}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}