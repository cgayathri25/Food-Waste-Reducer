import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

/* ─── CSS (Updated Badge & Floating Veg Styles) ─── */
const INVENTORY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  .inv-body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Outfit', system-ui, sans-serif;
    background: #f1f5f9;
    color: #1e293b;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Prominent Floating Background Elements ── */
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

  /* ── Nav ── */
  .inv-nav {
    background: rgba(246,250,247,.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: 20px 64px;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    border-bottom: 1px solid rgba(45,138,93,.07);
    position: sticky; top: 0; z-index: 100;
  }
  .inv-nav-logo {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 1.15rem; color: #2d8a5d;
    text-decoration: none;
  }
  .inv-nav ul { display: flex; list-style: none; gap: 4px; margin: 0; padding: 0; align-items: center; }
  .inv-nav ul li a {
    text-decoration: none; color: #4a6741; font-weight: 500;
    font-size: .88rem; padding: 8px 15px; border-radius: 100px;
    transition: all .22s; display: inline-block;
  }
  .inv-nav ul li a:hover { background: rgba(45,138,93,.09); color: #2d8a5d; }
  
  .inv-nav ul li .active { color: #2d8a5d; background: rgba(45,138,93,.09); }
  
  .inv-login-btn {
    background: #2d8a5d; color: #fff !important;
    padding: 9px 22px;
    box-shadow: 0 4px 18px rgba(45,138,93,.3);
    text-decoration: none;
    border-radius: 100px;
    font-size: .88rem;
    font-weight: 500;
    transition: all .22s;
  }

  /* ── Page ── */
  .inv-page { max-width: 960px; margin: 0 auto; padding: 40px 24px 80px; position: relative; z-index: 2; }
  .inv-title {
    font-size: 2.4rem; font-weight: 900; letter-spacing: -2px;
    color: #0f172a; margin-bottom: 32px;
  }

  /* ── Form Card ── */
  .inv-form-card {
    background: white; border-radius: 28px; padding: 32px 36px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    border: 1px solid rgba(45,138,93,.08);
    margin-bottom: 32px;
  }
  .inv-form-card h3 {
    font-size: 1rem; font-weight: 800; color: #2d8a5d;
    text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 22px;
  }
  .inv-form { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .inv-form-full { grid-column: span 2; }

  .inv-input {
    width: 100%; padding: 13px 18px;
    border: 1.5px solid #e2e8f0; border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: .95rem; color: #1e293b;
    outline: none; transition: border .2s, box-shadow .2s;
    background: #fafafa; box-sizing: border-box;
  }
  .inv-input:focus { border-color: #2d8a5d; box-shadow: 0 0 0 3px rgba(45,138,93,.12); background: white; }

  .inv-date-label {
    font-size: .75rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 5px; display: block;
  }

  .inv-btn-row { display: flex; gap: 12px; margin-top: 6px; grid-column: span 2; }
  .inv-btn {
    padding: 13px 28px; border: none; border-radius: 100px;
    font-family: 'Outfit', sans-serif; font-size: .95rem; font-weight: 700;
    cursor: pointer; transition: all .2s;
  }
  .inv-btn-primary { background: #2d8a5d; color: white; box-shadow: 0 6px 20px rgba(45,138,93,.3); flex: 1; }
  .inv-btn-primary:hover { background: #1b5e20; transform: translateY(-1px); }

  /* ── Table ── */
  .inv-table-card {
    background: white; border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    border: 1px solid rgba(45,138,93,.08);
    overflow: hidden;
  }
  .inv-table-header {
    padding: 22px 28px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
  }
  .inv-table-header h3 { margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a; }
  .inv-item-count {
    font-size: .78rem; font-weight: 700; background: rgba(45,138,93,.1);
    color: #2d8a5d; padding: 4px 12px; border-radius: 100px;
  }

  table.inv-table { width: 100%; border-collapse: collapse; }
  table.inv-table thead tr { background: #f8fafc; }
  table.inv-table th {
    padding: 13px 20px; text-align: left;
    font-size: .72rem; font-weight: 800; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1.2px;
  }
  table.inv-table td { padding: 14px 20px; border-top: 1px solid #f1f5f9; font-size: .92rem; }
  table.inv-table tbody tr { transition: background .15s; }
  table.inv-table tbody tr:hover { background: #fafffe; }

  .inv-food-name { font-weight: 700; color: #0f172a; }
  .inv-qty { font-weight: 600; color: #475569; }

  /* ── Dynamic Badges ── */
  .inv-badge {
    display: inline-block; padding: 4px 14px; border-radius: 100px;
    font-size: .7rem; font-weight: 800; letter-spacing: .5px;
    text-transform: uppercase;
  }
  .inv-badge.fresh    { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .inv-badge.urgent   { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
  .inv-badge.expired  { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

  .inv-del-btn {
    background: none; border: 1.5px solid #fecaca; color: #ef4444;
    padding: 6px 16px; border-radius: 100px; font-size: .8rem; font-weight: 700;
    cursor: pointer; transition: all .2s; font-family: 'Outfit', sans-serif;
  }
  .inv-del-btn:hover { background: #fee2e2; border-color: #ef4444; }

  .inv-empty {
    text-align: center; padding: 56px 20px; color: #94a3b8;
  }
  .inv-empty-icon { font-size: 3rem; margin-bottom: 12px; }
  .inv-empty p { font-size: .95rem; font-weight: 500; }

  @media (max-width: 700px) {
    .inv-nav { padding: 14px 16px; }
    .inv-nav ul { display: none; }
    .inv-form { grid-template-columns: 1fr; }
    .inv-form-full { grid-column: span 1; }
    .inv-btn-row { grid-column: span 1; flex-direction: column; }
    .inv-title { font-size: 1.8rem; }
    table.inv-table th, table.inv-table td { padding: 10px 12px; font-size: .82rem; }
  }
`;

/* ─── Helpers (Fixed Comparison) ─── */
const getStatus = (expiryDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp - now;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (exp < now) {
    return { label: "Expired", cls: "expired" };
  }
  
  if (exp.getTime() === now.getTime()) {
    return { label: "Expires Today", cls: "urgent" };
  }

  if (diffDays > 0 && diffDays <= 3) {
    return { label: "Expiring Soon", cls: "urgent" }; 
  }

  return { label: "Fresh", cls: "fresh" };
};

const NAV_LINKS = ["Home", "Dashboard", "Inventory", "Meals", "Alerts", "Food Share"];

export default function Inventory() {
  const navigate                  = useNavigate();
  const [foods, setFoods]         = useState([]);
  const [name, setName]           = useState("");
  const [qty, setQty]             = useState("");
  const [expiry, setExpiry]       = useState("");

  const userId = localStorage.getItem("dbUserId");
  const initial = localStorage.getItem("userInitial") || "G";
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  const fetchInventory = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/inventory/${userId}`);
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!document.getElementById("inv-styles")) {
      const s = document.createElement("style");
      s.id = "inv-styles";
      s.textContent = INVENTORY_CSS;
      document.head.appendChild(s);
    }
    fetchInventory();
  }, [userId]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !qty || !expiry) return;

    const newItem = {
      userId,
      itemName: name.trim(),
      quantity: qty,
      expiryDate: expiry
    };

    try {
      await axios.post('http://localhost:8000/api/inventory/add', newItem);
      setName(""); setQty(""); setExpiry("");
      await fetchInventory(); 
    } catch (err) {
      alert("Failed to save to database.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/inventory/${id}`);
      fetchInventory(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="inv-body">
      {/* 8 Prominent Floating Background Elements */}
      <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥬</div>
      <div className="veg-float" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
      <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
      <div className="veg-float" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
      <div className="veg-float" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
      <div className="veg-float" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
      <div className="veg-float" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
      <div className="veg-float" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

      <nav className="inv-nav">
        <Link to="/home" className="inv-nav-logo">🌱 Food Waste Reducer</Link>
        <ul>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <Link 
                to={l === "Home" ? "/home" : `/${l.toLowerCase().replace(/\s+/g, '-')}`} 
                className={l === "Inventory" ? "active" : ""}
              >
                {l}
              </Link>
            </li>
          ))}
          {isLoggedIn ? (
            <li>
                <div style={{
                    width: '38px', height: '38px', background: '#2d8a5d', 
                    color: '#fff', borderRadius: '50%', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', cursor: 'pointer', marginLeft: '15px', 
                    border: '2px solid #e4f5ec'
                }} onClick={() => {
                    localStorage.removeItem("userLoggedIn");
                    navigate("/"); 
                }}>
                    {initial}
                </div>
            </li>
          ) : (
            <li><Link to="/" className="inv-login-btn">Login</Link></li>
          )}
        </ul>
      </nav>

      <div className="inv-page">
        <h1 className="inv-title">Food Inventory</h1>

        <div className="inv-form-card">
          <h3>Add Food Item</h3>
          <form className="inv-form" onSubmit={addItem}>
            <input
              className="inv-input"
              type="text"
              placeholder="Food Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="inv-input"
              type="text" 
              placeholder="Quantity (e.g., 2 kg)"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <div>
              <label className="inv-date-label">Expiry Date</label>
              <input
                className="inv-input"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>

            <div className="inv-btn-row">
              <button type="submit" className="inv-btn inv-btn-primary">
                + Add item to the Inventory
              </button>
            </div>
          </form>
        </div>

        <div className="inv-table-card">
          <div className="inv-table-header">
            <h3>Your Managed Inventory</h3>
            <span className="inv-item-count">{foods.length} items</span>
          </div>

          {foods.length === 0 ? (
            <div className="inv-empty">
              <div className="inv-empty-icon">🥦</div>
              <p>Your inventory is empty.</p>
            </div>
          ) : (
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => {
                  const status = getStatus(food.expiryDate);
                  return (
                    <tr key={food._id}>
                      <td className="inv-food-name">{food.itemName}</td>
                      <td className="inv-qty">{food.quantity}</td>
                      <td>{new Date(food.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td>
                        <span className={`inv-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td>
                        <button className="inv-del-btn" onClick={() => deleteItem(food._id)}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}