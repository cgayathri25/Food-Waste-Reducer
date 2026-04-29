import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HIW_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;800&display=swap');

  .hiw-body {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    background: #f6faf7; color: #1e293b;
    overflow-x: hidden; position: relative;
  }

  /* ── Floating Background Elements ── */
  .veg-float {
    position: absolute; font-size: 3rem; opacity: 0.15;
    filter: blur(1px); pointer-events: none; z-index: 1;
    animation: floatAnim 10s infinite ease-in-out;
  }
  @keyframes floatAnim {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-40px) rotate(20deg); }
  }

  /* ── Content Wrapper ── */
  .hiw-container {
    max-width: 900px; margin: 0 auto; padding: 120px 24px;
    position: relative; z-index: 10;
  }

  .hiw-header { text-align: center; margin-bottom: 80px; }
  .hiw-title { 
    font-family: 'Playfair Display', serif; font-size: 3.5rem; 
    color: #2d8a5d; margin-bottom: 16px; 
  }
  .hiw-subtitle { color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

  /* ── The Guide Points ── */
  .hiw-grid { display: grid; gap: 40px; }
  
  .hiw-step {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(45, 138, 93, 0.1);
    padding: 40px; border-radius: 32px;
    display: flex; gap: 30px; align-items: flex-start;
    transition: transform 0.3s ease;
  }
  .hiw-step:hover { transform: scale(1.02); background: #fff; }

  .step-num {
    background: #2d8a5d; color: #fff;
    width: 50px; height: 50px; border-radius: 15px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1.2rem; flex-shrink: 0;
    box-shadow: 0 10px 20px rgba(45, 138, 93, 0.2);
  }

  .step-content h3 { 
    font-family: 'Playfair Display', serif; font-size: 1.8rem; 
    color: #0f172a; margin: 0 0 15px; 
  }
  .step-content ul { list-style: none; padding: 0; }
  .step-content li { 
    margin-bottom: 12px; padding-left: 24px; position: relative;
    color: #475569; line-height: 1.6;
  }
  .step-content li::before {
    content: "→"; position: absolute; left: 0; color: #2d8a5d; font-weight: bold;
  }

  .back-btn {
    display: inline-block; margin-top: 50px; padding: 15px 35px;
    background: #2d8a5d; color: #fff; text-decoration: none;
    border-radius: 100px; font-weight: 600; transition: 0.3s;
    box-shadow: 0 8px 25px rgba(45, 138, 93, 0.3);
  }
  .back-btn:hover { background: #1b5e20; transform: translateY(-3px); }
`;

export default function HowItWorks() {
  const navigate = useNavigate();

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = HIW_CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  return (
    <div className="hiw-body">
      {/* Floating Elements */}
      <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥦</div>
      <div className="veg-float" style={{ top: '40%', right: '8%', animationDelay: '2s' }}>🍎</div>
      <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '4s' }}>🥕</div>
      <div className="veg-float" style={{ top: '70%', right: '15%', animationDelay: '1s' }}>🥑</div>

      <div className="hiw-container">
        <div className="hiw-header">
          <h1 className="hiw-title">How It Works</h1>
          <p className="hiw-subtitle">Your step-by-step guide to mastering a zero-waste kitchen lifestyle.</p>
        </div>

        <div className="hiw-grid">
          <div className="hiw-step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>Home Dashboard</h3>
              <ul>
                <li>Central Navigation: Access all core modules—Dashboard, Inventory, Alerts, and Meals.</li>
                <li>Real-Time Tracking: View the "Items Tracked" card to see your kitchen volume.</li>
                <li>Sustainability Metrics: Review personalized waste reduction and savings stats.</li>
              </ul>
            </div>
          </div>

          <div className="hiw-step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>Inventory Management</h3>
              <ul>
                <li>Item Logging: Add groceries with name, quantity, and expiry date.</li>
                <li>Automated Classification: System assigns Fresh, Expiring Soon, or Urgent tags.</li>
                <li>Database Cleanup: Delete items as you consume them to keep data accurate.</li>
              </ul>
            </div>
          </div>

          <div className="hiw-step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>Expiry Monitoring & Analytics</h3>
              <ul>
                <li>Prioritized Alerts: Identify at-risk food through color-coded cards.</li>
                <li>Dynamic Visualizations: Use the Stock Analytics graph to see waste ratios.</li>
                <li>Efficiency Tracking: Monitor your kitchen success rate percentage.</li>
              </ul>
            </div>
          </div>

          <div className="hiw-step">
            <div className="step-num">4</div>
            <div className="step-content">
              <h3>Waste Prevention Tools</h3>
              <ul>
                <li>Meal Integration: Find recipes specifically for expiring ingredients.</li>
                <li>Surplus Sharing: Donate edible surplus to the local Hyderabad community.</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/home')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}