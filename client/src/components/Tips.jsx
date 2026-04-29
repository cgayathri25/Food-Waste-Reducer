import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TIPS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;800&display=swap');

  .tips-body {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    background: #f0f7f2; color: #1e293b;
    padding-bottom: 100px; position: relative;
    overflow-x: hidden;
  }

  /* ── Deep Layer Floating Elements ── */
  .veg-float {
    position: fixed; /* Changed to fixed so they follow as you scroll */
    font-size: 5rem; /* Made them larger for better visibility */
    opacity: 0.45;
    filter: blur(2px); 
    pointer-events: none; 
    z-index: 1;
    animation: floatAnim 6s infinite ease-in-out; 
  }
  @keyframes floatAnim {
    0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
    50% { transform: translateY(-100px) rotate(45deg) scale(1.2); }
  }

  /* ── Hero Section ── */
  .tips-hero {
    background: linear-gradient(135deg, #2d8a5d 0%, #1b5e20 100%);
    color: white; padding: 140px 24px 120px; text-align: center;
    clip-path: ellipse(150% 100% at 50% 0%);
    position: relative; z-index: 5;
  }
  .tips-hero h1 { 
    font-family: 'Playfair Display', serif; font-size: 4rem; 
    margin-bottom: 20px; letter-spacing: -2px;
  }
  .tips-hero p { opacity: 0.85; max-width: 700px; margin: 0 auto; font-size: 1.25rem; font-weight: 300; }

  /* ── Container Logic (Creating "Windows") ── */
  .tips-container { 
    max-width: 1400px; 
    margin: -50px auto 0; 
    padding: 0 40px; 
    position: relative; z-index: 10;
  }
  
  .tips-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
    gap: 40px; /* Increased gap to see the background between cards */
  }
  
  /* ── Enhanced Glassmorphic Cards ── */
  .tip-card {
    background: rgba(255, 255, 255, 0.7); /* More transparent */
    backdrop-filter: blur(20px); /* Stronger blur for "frost" effect */
    border-radius: 40px; padding: 40px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.04);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
  }
  .tip-card:hover { 
    transform: scale(1.05); 
    background: rgba(255, 255, 255, 0.9); 
    box-shadow: 0 40px 80px rgba(45, 138, 93, 0.15);
  }
  
  .tip-icon { font-size: 3rem; margin-bottom: 20px; display: block; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }
  .tip-card h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #1b5e20; margin-bottom: 18px; }
  
  .tip-list { list-style: none; padding: 0; flex-grow: 1; }
  .tip-list li { 
    margin-bottom: 12px; padding-left: 30px; position: relative; 
    font-size: 0.95rem; color: #2d3748; line-height: 1.6; font-weight: 500;
  }
  .tip-list li::before {
    content: "●"; position: absolute; left: 0; color: #2d8a5d; font-size: 0.8rem; top: 2px;
  }

  .nav-back {
    position: fixed; top: 40px; left: 50px; z-index: 100;
    background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255,255,255,0.4);
    padding: 14px 28px; border-radius: 100px; font-weight: 700; cursor: pointer;
    backdrop-filter: blur(15px); transition: 0.3s;
  }
  .nav-back:hover { background: white; color: #1b5e20; transform: translateX(-5px); }
`;

export default function Tips() {
    const navigate = useNavigate();

    useEffect(() => {
        const s = document.createElement('style');
        s.textContent = TIPS_CSS; document.head.appendChild(s);
        return () => s.remove();
    }, []);

    const tipData = [
        { icon: "🥦", title: "Fresh Produce", items: ["Keep ethylene-producers (apples) away from greens.", "Store herbs upright in water jars.", "Line crisper drawers with paper towels."] },
        { icon: "🧅", title: "Pantry Grains", items: ["Never store onions and potatoes together.", "Freeze whole-grain flours for longevity.", "Use bay leaves to deter pantry pests."] },
        { icon: "🧊", title: "Smart Freezing", items: ["Freeze tomato paste in small dollops.", "Remove all air from bags to prevent burn.", "Blanch veggies to lock in vitamins."] },
        { icon: "🧀", title: "Fridge Logic", items: ["Keep eggs in the main body, not the door.", "Store dairy at the back for max cold.", "Keep raw meat on the bottom shelf."] },
        { icon: "🥛", title: "Dairy Care", items: ["Wrap cheese in parchment, not plastic.", "Flip yogurt tubs to create a vacuum seal.", "Change tofu water daily for freshness."] },
        { icon: "🌱", title: "Eco Habits", items: ["Use an 'Eat Me First' bin for expiring items.", "Switch to glass for better visibility.", "Regrow scallions from kitchen scraps."] },
        { icon: "🥖", title: "Bakery Items", items: ["Keep bread at room temp in a bread box.", "Freeze cakes in slices for easy thawing.", "Store honey in a warm, dark cupboard."] },
        { icon: "🍳", title: "Leftover Tips", items: ["Cool hot food quickly in shallow pans.", "Only reheat the portion you will eat.", "Don't leave cooked food out past 2 hours."] },
        { icon: "🌶️", title: "Spice Storage", items: ["Store red spices in the fridge for color.", "Keep spices away from steam and heat.", "Grind whole spices fresh for max oils."] },
        { icon: "🥕", title: "Root Veggies", items: ["Store potatoes with apples to stop sprouts.", "Keep carrots in water to stay crunchy.", "Garlic needs dry air and dark spaces."] },
        { icon: "🐟", title: "Seafood Guide", items: ["Store fish on ice even inside the fridge.", "Consume fresh seafood within 2 days.", "Always thaw seafood inside the fridge."] },
        { icon: "🥥", title: "Oils & Fats", items: ["Keep olive oil away from light and heat.", "Store nut oils in the fridge for stability.", "Keep vinegars tightly sealed and cool."] }
    ];

    return (
        <div className="tips-body">
            {/* 8 Giant, Distinct Floating Elements */}
            <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥬</div>
            <div className="veg-float" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
            <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
            <div className="veg-float" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
            <div className="veg-float" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
            <div className="veg-float" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
            <div className="veg-float" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
            <div className="veg-float" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

            <button className="nav-back" onClick={() => navigate('/home')}>← Home</button>
            
            <div className="tips-hero">
                <h1>Kitchen Encyclopedia</h1>
                <p>12 essential pillars to maximize freshness and eliminate waste.</p>
            </div>

            <div className="tips-container">
                <div className="tips-grid">
                    {tipData.map((tip, index) => (
                        <div className="tip-card" key={index}>
                            <span className="tip-icon">{tip.icon}</span>
                            <h3>{tip.title}</h3>
                            <ul className="tip-list">
                                {tip.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}