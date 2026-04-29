import { messaging } from "../firebase-config"; 
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const ALERTS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  .alrt-body {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', system-ui, sans-serif;
    background: #f1f5f9; color: #1e293b; overflow-x: hidden;
    position: relative;
  }

  /* ── 8 Prominent Floating Elements ── */
  .veg-float {
    position: fixed; font-size: 3.5rem; 
    opacity: 0.45; filter: blur(0.5px);
    pointer-events: none; z-index: 1;
    animation: floatAnim 5s infinite ease-in-out;
  }
  @keyframes floatAnim {
    0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
    50% { transform: translateY(-60px) rotate(25deg) scale(1.1); }
  }

  /* ── Home Button (Lowered to 48px) ── */
  .nav-back {
    position: fixed; top: 48px; left: 35px; z-index: 100;
    background: #2d8a5d; color: white; border: none;
    padding: 8px 16px; border-radius: 100px; font-weight: 600; 
    font-size: 0.8rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(45,138,93,0.2); transition: 0.3s;
  }
  .nav-back:hover { background: #1b5e20; transform: scale(1.05); }

  /* ── Nav ── */
  .alrt-nav {
    background: rgba(246,250,247,.95);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    padding: 20px 64px;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    border-bottom: 1px solid rgba(45,138,93,.07);
    position: sticky; top: 0; z-index: 100;
  }
  .alrt-nav-logo {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 1.15rem; color: #2d8a5d; text-decoration: none;
  }
  .alrt-nav ul { display: flex; list-style: none; gap: 4px; margin: 0; padding: 0; align-items: center; }
  
  .alrt-nav ul li a {
    text-decoration: none; color: #4a6741; font-weight: 500;
    font-size: .88rem; padding: 8px 15px; border-radius: 100px;
    transition: all .22s; display: inline-block;
  }
  .alrt-nav ul li a:hover { background: rgba(45,138,93,.09); color: #2d8a5d; }
  
  .alrt-nav ul li .active { color: #2d8a5d; background: rgba(45,138,93,.09); }
  
  .alrt-login-btn {
    background: #2d8a5d !important; color: #fff !important;
    padding: 9px 22px !important; text-decoration: none;
    box-shadow: 0 4px 18px rgba(45,138,93,.3); border-radius: 100px;
    font-size: .88rem; font-weight: 500; display: inline-block;
  }
  .alrt-login-btn:hover { background: #1b5e20 !important; }

  /* ── Page ── */
  .alrt-page { max-width: 780px; margin: 0 auto; padding: 44px 24px 80px; position: relative; z-index: 2; }

  .alrt-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .alrt-title { font-size: 2.4rem; font-weight: 900; letter-spacing: -2px; color: #0f172a; }
  .alrt-badge-count {
    font-size: .78rem; font-weight: 700;
    background: #fee2e2; color: #991b1b;
    padding: 5px 14px; border-radius: 100px;
  }
  .alrt-subtitle { font-size: .92rem; color: #64748b; margin-bottom: 32px; }

  /* ── Summary strip (Opaque Boxes) ── */
  .alrt-summary {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 32px;
  }
  .alrt-summary-card {
    background: #ffffff; border-radius: 20px; padding: 20px 18px;
    border: 1px solid rgba(0,0,0,.06); box-shadow: 0 4px 16px rgba(0,0,0,.04);
    text-align: center;
  }
  .alrt-sum-num { font-size: 2rem; font-weight: 900; margin-bottom: 4px; }
  .alrt-sum-num.red    { color: #ef4444; }
  .alrt-sum-num.amber  { color: #f59e0b; }
  .alrt-sum-num.green  { color: #2d8a5d; }
  .alrt-sum-lbl { font-size: .74rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

  /* ── Section label ── */
  .alrt-section-lbl {
    font-size: .72rem; font-weight: 800; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1.4px;
    margin-bottom: 12px; margin-top: 28px;
  }

  /* ── Alert cards (Opaque Boxes) ── */
  .alrt-card {
    background: #ffffff; border-radius: 20px; padding: 20px 22px;
    border: 1px solid rgba(0,0,0,.06); box-shadow: 0 4px 16px rgba(0,0,0,.04);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 18px;
    transition: transform .18s, box-shadow .18s;
  }
  .alrt-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08); }

  .alrt-card.urgent  { border-left: 4px solid #ef4444; }
  .alrt-card.warning { border-left: 4px solid #f59e0b; }
  .alrt-card.safe    { border-left: 4px solid #2d8a5d; }
  .alrt-card.expired { border-left: 4px solid #94a3b8; background: #fafafa; }

  .alrt-icon-wrap {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .alrt-icon-wrap.urgent  { background: #fee2e2; }
  .alrt-icon-wrap.warning { background: #fef9c3; }
  .alrt-icon-wrap.safe    { background: #dcfce7; }
  .alrt-icon-wrap.expired { background: #f1f5f9; }

  .alrt-card-body { flex: 1; }
  .alrt-card-name { font-weight: 700; font-size: 1rem; color: #0f172a; margin-bottom: 3px; }
  .alrt-card-sub  { font-size: .82rem; color: #64748b; }

  .alrt-pill {
    font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; flex-shrink: 0;
  }
  .alrt-pill.urgent  { background: #fee2e2; color: #991b1b; }
  .alrt-pill.warning { background: #fef9c3; color: #854d0e; }
  .alrt-pill.safe    { background: #dcfce7; color: #166434; }
  .alrt-pill.expired { background: #f1f5f9; color: #64748b; }

  .alrt-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
  .alrt-empty-icon { font-size: 3rem; margin-bottom: 12px; }
  .alrt-empty p { font-size: .95rem; font-weight: 500; }

  @media (max-width: 700px) {
    .alrt-nav { padding: 14px 16px; }
    .alrt-nav ul { display: none; }
    .alrt-title { font-size: 1.8rem; }
    .alrt-summary { grid-template-columns: repeat(3,1fr); gap: 8px; }
    .alrt-sum-num { font-size: 1.5rem; }
  }
`;

const NAV_LINKS = ["Home", "Dashboard", "Inventory", "Meals", "Alerts", "Food Share"];

function classify(food) {
  if (!food || !food.expiryDate) return { level: "safe", label: "No date", icon: "📅", days: null, diff: 99 };
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const expStr = food.expiryDate.split('T')[0];
    const todayDate = new Date(todayStr);
    const expDate = new Date(expStr);
    const diffTime = expDate - todayDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (expDate < todayDate) return { level: "expired", label: "Expired. Needs to be disposed.", icon: "🪦", days: null, diff: diffDays };
    if (expStr === todayStr) return { level: "urgent", label: "Expires Today", icon: "🚨", days: 0, diff: 0 };
    if (diffDays > 0 && diffDays <= 3) return { level: "warning", label: "Expires in " + diffDays + " days", icon: "⚠️", days: diffDays, diff: diffDays };
    return { level: "safe", label: "Expires in " + diffDays + " days", icon: "✅", days: diffDays, diff: diffDays };
  } catch (err) {
    return { level: "safe", label: "Error", icon: "❓", days: null, diff: 99 };
  }
}

export default function Alerts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const initial = localStorage.getItem("userInitial") || "G";
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  // --- NEW: Push Notification Logic ---
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const token = await getToken(messaging, { 
            vapidKey: "BEKpEUIbRTdOgkqh52q8C2JYpfixZ000idDFY6DL7FXm3vIEEy-f4UVg5VkNS107672gt9WTfWWj1esg0rcETW8" 
          });
          if (token) {
            console.log("FCM Token:", token);
            const userId = localStorage.getItem("dbUserId");
            if (userId) {
              await axios.post("http://localhost:8000/api/notifications/save-token", {
                userId,
                token
              });
            }
          }
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground Message: ", payload);
      alert(`Food Alert: ${payload.notification.body}`);
    });

    return () => unsubscribe();
  }, []);

  // --- Original Style & Fetch Logic ---
  useEffect(() => {
    if (!document.getElementById("alrt-styles")) {
      const s = document.createElement("style");
      s.id = "alrt-styles";
      s.textContent = ALERTS_CSS;
      document.head.appendChild(s);
    }
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/inventory');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        const order = { expired: 0, urgent: 1, warning: 2, safe: 3 };
        const classified = data
          .map(f => ({ ...f, ...classify(f) }))
          .sort((a, b) => order[a.level] - order[b.level] || a.diff - b.diff);
        setItems(classified);
      } catch (error) { console.error("Failed to fetch inventory:", error); }
    };
    fetchInventoryData();
  }, []);

  const urgent = items.filter(i => i.level === "urgent");
  const warning = items.filter(i => i.level === "warning");
  const expired = items.filter(i => i.level === "expired");
  const safe = items.filter(i => i.level === "safe");
  const alertCount = urgent.length + warning.length + expired.length;

  const Section = ({ title, list }) => {
    if (list.length === 0) return null;
    return (
      <>
        <div className="alrt-section-lbl">{title}</div>
        {list.map(item => (
          <div key={item._id} className={"alrt-card " + item.level}>
            <div className={"alrt-icon-wrap " + item.level}>{item.icon}</div>
            <div className="alrt-card-body">
              <div className="alrt-card-name">{item.itemName}</div>
              <div className="alrt-card-sub">Qty: {item.quantity} · {item.label}</div>
            </div>
            <span className={"alrt-pill " + item.level}>
              {item.level === "expired" ? "Expired" : item.level === "urgent"  ? "Today" : item.days + "d left"}
            </span>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="alrt-body">
      {/* 8 Prominent Floating Elements */}
      <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥬</div>
      <div className="veg-float" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
      <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
      <div className="veg-float" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
      <div className="veg-float" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
      <div className="veg-float" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
      <div className="veg-float" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
      <div className="veg-float" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

      <button className="nav-back" onClick={() => navigate('/home')}>← Home</button>

      <nav className="alrt-nav">
        <Link to="/home" className="alrt-nav-logo"> Food Waste Reducer</Link>
        <ul>
          {NAV_LINKS.map(l => (
            <li key={l}>
              <Link to={l === "Home" ? "/home" : "/" + l.toLowerCase().replace(/\s+/g, '-')} className={l === "Alerts" ? "active" : ""}>{l}</Link>
            </li>
          ))}
          {isLoggedIn ? (
            <li>
                <div style={{ width: '38px', height: '38px', background: '#2d8a5d', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', marginLeft: '15px', border: '2px solid #e4f5ec' }} onClick={() => { localStorage.removeItem("userLoggedIn"); navigate("/"); }}>{initial}</div>
            </li>
          ) : (
            <li><Link to="/" className="alrt-login-btn">Login</Link></li>
          )}
        </ul>
      </nav>

      <div className="alrt-page">
        <div className="alrt-header">
          <h1 className="alrt-title">Expiry Alerts</h1>
          {alertCount > 0 && <span className="alrt-badge-count">⚠ {alertCount} need attention</span>}
        </div>
        <p className="alrt-subtitle">{alertCount === 0 ? "Everything looks fresh! No urgent alerts right now." : "Items below need your attention to reduce waste."}</p>

        <div className="alrt-summary">
          <div className="alrt-summary-card">
            <div className="alrt-sum-num red">{expired.length + urgent.length}</div>
            <div className="alrt-sum-lbl">Urgent</div>
          </div>
          <div className="alrt-summary-card">
            <div className="alrt-sum-num amber">{warning.length}</div>
            <div className="alrt-sum-lbl">Expiring Soon</div>
          </div>
          <div className="alrt-summary-card">
            <div className="alrt-sum-num green">{safe.length}</div>
            <div className="alrt-sum-lbl">Fresh</div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="alrt-empty">
            <div className="alrt-empty-icon">😕</div>
            <p>No items in inventory yet. Add food from the Inventory page!</p>
          </div>
        ) : (
          <>
            <Section title=" Expired / Expiring Today" list={[...expired, ...urgent]} />
            <Section title=" Expiring Soon (within 3 days)" list={warning} />
            <Section title=" Fresh Items" list={safe} />
          </>
        )}
      </div>
    </div>
  );
}
