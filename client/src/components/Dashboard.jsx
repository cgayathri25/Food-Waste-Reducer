import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DASH_CSS = `
  .dash-body { font-family: 'Outfit', sans-serif; background: #f1f5f9; min-height: 100vh; padding: 40px; position: relative; overflow-x: hidden; }
  .dash-user-greeting { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #2d8a5d; margin-top: 8px; font-weight: 700; }
  .dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; position: relative; z-index: 2; }
  
  .stat-card { background: white; padding: 30px; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .stat-val { font-size: 2.5rem; font-weight: 900; margin-bottom: 5px; }
  .stat-lbl { color: #94a3b8; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; }
  .eff-card { background: #166534; color: white; }
  
  .chart-section { 
    background: white; 
    padding: 40px; 
    border-radius: 32px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 40px; 
    max-width: 650px; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    margin-top: 20px;
    position: relative;
    z-index: 2;
  }

  /* ── Smaller & Refined Home Button ── */
  .nav-back {
    position: absolute; top: 35px; left: 35px; z-index: 100;
    background: #2d8a5d; color: white; border: none;
    padding: 8px 16px; border-radius: 100px; font-weight: 600; 
    font-size: 0.8rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(45,138,93,0.2); transition: 0.3s;
  }
  .nav-back:hover { background: #1b5e20; transform: scale(1.05); }

  .donut-hole { 
    width: 160px; height: 160px; border-radius: 50%; 
    display: flex; flex-direction: column; align-items: center; 
    justify-content: center; flex-shrink: 0; position: relative;
    transition: background 0.6s ease;
  }

  .donut-hole::after {
    content: ""; position: absolute; width: 124px; height: 124px;
    background: white; border-radius: 50%; z-index: 1;
  }

  .donut-content { position: relative; z-index: 2; text-align: center; line-height: 1.2; }

  .chart-legend { flex: 1; display: flex; flex-direction: column; gap: 12px; }

  .dash-veg {
    position: fixed; font-size: 2.2rem; opacity: 0.35; filter: blur(0.5px);
    pointer-events: none; z-index: 1; animation: dashFloat 6s infinite ease-in-out;
  }
  @keyframes dashFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-40px) rotate(20deg); }
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, expiring: 0, wasted: 0, fresh: 0, efficiency: 100 });
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = DASH_CSS;
    document.head.appendChild(s);

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/inventory');
        const items = await res.json();
        
        const now = new Date();
        now.setHours(0,0,0,0);
        
        let expiringCount = 0;
        let wastedCount = 0;
        let freshCount = 0;

        items.forEach(item => {
          const exp = new Date(item.expiryDate);
          exp.setHours(0,0,0,0);

          if (exp < now) {
            wastedCount++; 
          } else if (exp.getTime() === now.getTime() || (exp - now) / (1000 * 60 * 60 * 24) <= 3) {
            expiringCount++; 
          } else {
            freshCount++; 
          }
        });

        const total = items.length;
        const efficiency = total > 0 ? Math.round(((total - wastedCount) / total) * 100) : 100;
        
        setStats({ total, expiring: expiringCount, wasted: wastedCount, fresh: freshCount, efficiency });
      } catch (err) { console.error(err); }
    };
    fetchStats();
    return () => s.remove();
  }, []);

  const hasItems = stats.total > 0;
  const total = stats.total || 1; 
  const freshDeg = (stats.fresh / total) * 360;
  const expiringDeg = (stats.expiring / total) * 360;
  
  const chartStyle = {
    background: hasItems 
      ? `conic-gradient(#2d8a5d 0deg ${freshDeg}deg, #f59e0b ${freshDeg}deg ${freshDeg + expiringDeg}deg, #ef4444 ${freshDeg + expiringDeg}deg 360deg)`
      : `conic-gradient(#3b82f6 0deg 360deg)` 
  };

  return (
    <div className="dash-body">
      <div className="dash-veg" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥦</div>
      <div className="dash-veg" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
      <div className="dash-veg" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
      <div className="dash-veg" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
      <div className="dash-veg" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
      <div className="dash-veg" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
      <div className="dash-veg" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
      <div className="dash-veg" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

      <button className="nav-back" onClick={() => navigate('/home')}>← Home</button>

      {/* Increased padding-left to 120px to give the button room */}
      <header style={{ paddingLeft: '120px', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.4rem', margin: 0 }}>Stock Analytics</h1>
        <div className="dash-user-greeting">Welcome to your Kitchen, {userName}!</div>
      </header>

      <div className="dash-grid">
        <div className="stat-card"><div className="stat-val">{stats.total}</div><div className="stat-lbl">Total Items</div></div>
        <div className="stat-card"><div className="stat-val" style={{color: '#f59e0b'}}>{stats.expiring}</div><div className="stat-lbl">Expiring Soon</div></div>
        <div className="stat-card"><div className="stat-val" style={{color: '#ef4444'}}>{stats.wasted}</div><div className="stat-lbl">Wasted Items</div></div>
        <div className="stat-card eff-card"><div className="stat-val">{stats.efficiency}%</div><div className="stat-lbl" style={{color: '#dcfce7'}}>Efficiency</div></div>
      </div>

      <div className="chart-section" style={{ marginLeft: '120px' }}>
        <div className="donut-hole" style={chartStyle}>
            <div className="donut-content">
              <span style={{fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800}}>OVERALL</span>
              <br/>
              <span style={{fontWeight: 900, fontSize: '1.2rem', color: '#0f172a'}}>Stock</span>
            </div>
        </div>

        <div className="chart-legend">
            {!hasItems ? (
              <p style={{color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: '1.5'}}>
                Your kitchen is currently empty. Add items in the Inventory to see analytics!
              </p>
            ) : (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '0.9rem', color: '#64748b'}}><span style={{color: '#2d8a5d'}}>●</span> Fresh Stock</span>
                    <strong style={{fontSize: '1rem'}}>{stats.fresh}</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '0.9rem', color: '#64748b'}}><span style={{color: '#f59e0b'}}>●</span> Expiring Soon</span>
                    <strong style={{fontSize: '1rem'}}>{stats.expiring}</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '0.9rem', color: '#64748b'}}><span style={{color: '#ef4444'}}>●</span> Wasted Items</span>
                    <strong style={{fontSize: '1rem'}}>{stats.wasted}</strong>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}