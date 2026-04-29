import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";

const MEAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  .meal-body {
    margin: 0; min-height: 100vh;
    font-family: 'Outfit', system-ui, sans-serif;
    background: #f1f5f9; color: #1e293b; overflow-x: hidden;
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

  /* ── Home Button (Lowered to 48px) ── */
  .nav-back {
    position: fixed; top: 88px; left: 35px; z-index: 100;
    background: #2d8a5d; color: white; border: none;
    padding: 15px 30px; border-radius: 100px; font-weight: 600; 
    font-size: 0.8rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(45,138,93,0.2); transition: 0.3s;
  }
  .nav-back:hover { background: #1b5e20; transform: scale(1.05); }

  /* ── Modal Styles ── */
  .recipe-modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px);
    z-index: 1000; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.3s ease;
  }
  .recipe-modal {
    background: white; width: 100%; max-width: 600px; max-height: 90vh;
    border-radius: 32px; overflow-y: auto; position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 40px; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .modal-close {
    position: absolute; top: 20px; right: 20px; border: none; background: #f1f5f9;
    width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;
  }
  .modal-emoji { font-size: 4rem; margin-bottom: 20px; display: block; text-align: center; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #0f172a; margin-bottom: 20px; text-align: center; }
  .recipe-section { margin-bottom: 25px; }
  .recipe-section h4 { text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; color: #2d8a5d; margin-bottom: 12px; }
  .recipe-section p, .recipe-section li { font-size: 0.95rem; line-height: 1.6; color: #475569; }
  .recipe-section ul { padding-left: 20px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Page Styles ── */
  .meal-nav { position: relative; z-index: 50; background: rgba(246,250,247,.95); backdrop-filter: blur(24px); padding: 20px 64px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 12px rgba(0,0,0,0.05); border-bottom: 1px solid rgba(45,138,93,.07); }
  .meal-nav-logo { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.15rem; color: #2d8a5d; text-decoration: none; }
  .meal-nav ul { display: flex; list-style: none; gap: 4px; margin: 0; padding: 0; align-items: center; }
  .meal-nav ul li a { text-decoration: none; color: #4a6741; font-weight: 500; font-size: .88rem; padding: 8px 15px; border-radius: 100px; transition: all .22s; display: inline-block; }
  .meal-nav ul li a:hover { background: rgba(45,138,93,.09); color: #2d8a5d; }
  .meal-nav ul li .active { color: #2d8a5d; background: rgba(45,138,93,.09); }
  .meal-login-btn { background: #2d8a5d !important; color: #fff !important; padding: 9px 22px !important; border-radius: 100px; box-shadow: 0 4px 18px rgba(45,138,93,.3); text-decoration: none; display: inline-block; font-size: .88rem; font-weight: 500; }
  .meal-page { position: relative; z-index: 5; max-width: 1100px; margin: 0 auto; padding: 44px 28px 80px; }
  .meal-title { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; letter-spacing: -2px; color: #0f172a; margin-bottom: 6px; }
  .meal-subtitle { color: #64748b; font-size: .95rem; font-weight: 500; margin-bottom: 30px; }
  .meal-glass-card { background: rgba(255,255,255,.88); backdrop-filter: blur(20px); border-radius: 32px; padding: 36px 40px; border: 1px solid rgba(255,255,255,.6); box-shadow: 0 12px 45px rgba(0,0,0,0.04); margin-bottom: 30px; }
  .meal-card-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; }
  .meal-kitchen-label { font-size: .72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 14px; display: block; }
  .meal-ingredient-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; margin: 0; }
  .meal-ingredient-list li { background: white; padding: 7px 16px; border-radius: 100px; font-size: .82rem; font-weight: 700; color: #2d8a5d; box-shadow: 0 3px 10px rgba(0,0,0,.05); border: 1px solid rgba(45,138,93,.12); display: flex; align-items: center; gap: 6px; }
  .meal-gen-btn { background: linear-gradient(135deg, #2d8a5d, #1b5e20); color: white; border: none; padding: 15px 36px; border-radius: 100px; font-family: 'Outfit', sans-serif; font-size: .95rem; font-weight: 800; cursor: pointer; transition: all .25s; white-space: nowrap; box-shadow: 0 8px 24px rgba(45,138,93,.32); flex-shrink: 0; }
  .meal-gen-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(45,138,93,.42); }
  .meal-loading { text-align: center; padding: 48px 20px; color: #64748b; font-size: .95rem; font-weight: 500; }
  .meal-loading-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #e2e8f0; border-top-color: #2d8a5d; animation: mealSpin .7s linear infinite; margin: 0 auto 16px; }
  @keyframes mealSpin { to { transform: rotate(360deg); } }
  .meal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px; }
  .meal-card { background: white; padding: 28px; border-radius: 28px; border: 1px solid rgba(45,138,93,.07); box-shadow: 0 6px 24px rgba(0,0,0,.05); transition: all .28s; cursor: pointer; animation: mealFadeUp .4s ease both; }
  .meal-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(45,138,93,0.13); }
  @keyframes mealFadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
  .meal-card-emoji { font-size: 2.6rem; margin-bottom: 14px; display: block; }
  .meal-card-name { font-family: 'Playfair Display', serif; font-size: 1.18rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .meal-card-desc { font-size: .84rem; color: #64748b; line-height: 1.65; margin-bottom: 14px; }
  .meal-card-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
  .meal-tag { font-size: .7rem; font-weight: 800; padding: 3px 10px; border-radius: 100px; letter-spacing: .4px; }
  .meal-tag.uses { background: #dcfce7; color: #166534; }
  .meal-tag.time { background: #fef9c3; color: #854d0e; }
  .meal-tag.diff { background: #e0f2fe; color: #075985; }
  .meal-card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 4px; }
  .meal-card-stat { font-size: .76rem; color: #94a3b8; font-weight: 600; }
  .meal-try-btn { background: #2d8a5d; color: #fff; border: none; padding: 7px 18px; border-radius: 100px; font-family: 'Outfit', sans-serif; font-size: .78rem; font-weight: 700; cursor: pointer; transition: background .2s; }
  .meal-try-btn:hover { background: #1b5e20; }
`;

const RECIPE_DB = [
  { 
    name: "Classic Banana Bread", emoji: "🍌", keys: ["banana", "bananas"], 
    desc: "The perfect way to use up those overripe bananas!", 
    time: "60 min", diff: "Medium", cals: "280 kcal",
    ingredients: ["3 ripe bananas", "1/2 cup melted butter", "1 cup sugar", "1 egg", "1 tsp vanilla", "1.5 cups flour", "1 tsp baking soda"],
    steps: ["Preheat oven to 350°F (175°C).", "Mash bananas in a bowl.", "Mix in butter, sugar, egg, and vanilla.", "Stir in baking soda and flour.", "Bake for 60 minutes in a loaf pan."]
  },
  { 
    name: "Apple Cinnamon Pie", emoji: "🥧", keys: ["apple", "apples"], 
    desc: "Warm, flaky crust with spiced cinnamon apples.", 
    time: "75 min", diff: "Hard", cals: "420 kcal",
    ingredients: ["6 large apples", "3/4 cup sugar", "2 tbsp flour", "1 tsp cinnamon", "Double pie crust dough", "1 tbsp butter"],
    steps: ["Peel and slice apples.", "Toss with sugar, flour, and cinnamon.", "Place into a pie crust.", "Cover with top crust and bake at 400°F (200°C) for 45 mins."]
  },
  { 
    name: "Grape Mojito", emoji: "🍸", keys: ["grape", "grapes"], 
    desc: "A refreshing twist on a classic with muddled grapes.", 
    time: "5 min", diff: "Easy", cals: "150 kcal",
    ingredients: ["10 fresh grapes", "6 mint leaves", "1/2 lime", "1 tbsp sugar", "2 oz White Rum", "Club soda"],
    steps: ["Muddle grapes, mint, and lime in a glass.", "Add sugar and rum.", "Fill with ice and top with club soda."]
  },
  { 
    name: "Tomato & Egg Scramble", emoji: "🍳", keys: ["tomato","egg","eggs"], 
    desc: "A quick, protein-packed scramble with juicy tomatoes.", 
    time: "10 min", diff: "Easy", cals: "220 kcal",
    ingredients: ["2 Eggs", "1 Tomato", "1 tsp Oil", "Salt & Pepper"],
    steps: ["Chop tomatoes into small cubes.", "Sauté in oil until soft.", "Add whisked eggs and scramble until firm."]
  },
  { 
    name: "Veggie Stir-Fry", emoji: "🥦", keys: ["carrot","spinach","broccoli"], 
    desc: "A fast way to clear out wilting greens and veggies.", 
    time: "15 min", diff: "Easy", cals: "180 kcal",
    ingredients: ["Mixed Veggies", "2 tbsp Soy Sauce", "1 tsp Ginger", "1 Garlic clove"],
    steps: ["Slice all veggies thinly.", "High-heat stir fry for 5 minutes.", "Add soy sauce, ginger, and garlic for the last 2 minutes."]
  },
  { 
    name: "Creamy Potato Soup", emoji: "🥣", keys: ["potato","milk","butter"], 
    desc: "Silky, warming soup that uses up pantry staples.", 
    time: "30 min", diff: "Medium", cals: "310 kcal",
    ingredients: ["3 Potatoes", "2 cups Milk", "2 tbsp Butter", "1 cup Water"],
    steps: ["Boil peeled potatoes until soft.", "Mash and return to pot.", "Stir in milk and butter over low heat until creamy."]
  }
];

export default function MealPlanner() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const userId = localStorage.getItem("dbUserId");
  const initialLetter = localStorage.getItem("userInitial") || "G";
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  useEffect(() => {
    if (!document.getElementById("meal-styles")) {
      const s = document.createElement("style");
      s.id = "meal-styles"; s.textContent = MEAL_CSS; document.head.appendChild(s);
    }
    const fetchInventory = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:8000/api/inventory/${userId}`);
        const data = await response.json();
        setFoods(Array.isArray(data) ? data : []);
      } catch (error) { console.error(error); }
    };
    fetchInventory();
  }, [userId]);

  const generateMeals = () => {
    setLoading(true); setGenerated(false);
    setTimeout(() => {
      const names = foods.map(f => (f.itemName || "").toLowerCase());
      const matched = RECIPE_DB.filter(r => r.keys.some(k => names.some(n => n.includes(k))));
      setRecipes(matched.length > 0 ? matched : RECIPE_DB.slice(0, 4));
      setLoading(false); setGenerated(true);
    }, 1000);
  };

  return (
    <div className="meal-body">
      <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥬</div>
      <div className="veg-float" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
      <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
      <div className="veg-float" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
      <div className="veg-float" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
      <div className="veg-float" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
      <div className="veg-float" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
      <div className="veg-float" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

      <button className="nav-back" onClick={() => navigate('/home')}>← Home</button>

      {selectedRecipe && (
        <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRecipe(null)}>×</button>
            <span className="modal-emoji">{selectedRecipe.emoji}</span>
            <h2 className="modal-title">{selectedRecipe.name}</h2>
            <div className="recipe-section">
              <h4>Ingredients</h4>
              <ul>{selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}</ul>
            </div>
            <div className="recipe-section">
              <h4>Instructions</h4>
              <ul>{selectedRecipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      <nav className="meal-nav">
        <Link to="/home" className="meal-nav-logo">🌱 Food Waste Reducer</Link>
        <ul>
          {["Home", "Dashboard", "Inventory", "Meals", "Alerts", "Food Share"].map(l => (
            <li key={l}>
              <Link to={l === "Home" ? "/home" : `/${l.toLowerCase().replace(/\s+/g, '-')}`} className={l === "Meals" ? "active" : ""}>{l}</Link>
            </li>
          ))}
          {isLoggedIn && (
            <li><div style={{ width: '38px', height: '38px', background: '#2d8a5d', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', marginLeft: '15px', border: '2px solid #e4f5ec' }} onClick={() => { localStorage.removeItem("userLoggedIn"); navigate("/"); }}>{initialLetter}</div></li>
          )}
        </ul>
      </nav>

      <div className="meal-page">
        <h1 className="meal-title">Meal Ideas</h1>
        <p className="meal-subtitle">Recipes based on what you have in the kitchen.</p>
        <div className="meal-glass-card">
          <div className="meal-card-header">
            <div style={{ flex: 1 }}>
              <span className="meal-kitchen-label">In Your Kitchen</span>
              {foods.length === 0 ? <p className="meal-empty-inv">No items in the Inventory currently...</p> : (
                <ul className="meal-ingredient-list">{foods.map(f => <li key={f._id}><span>{f.itemName}</span><span style={{ opacity: .5, fontSize: ".74rem" }}>×{f.quantity}</span></li>)}</ul>
              )}
            </div>
            <button className="meal-gen-btn" onClick={generateMeals} disabled={loading}>{loading ? "Finding Recipes…" : "Show Me Recipes"}</button>
          </div>
        </div>

        {loading && <div className="meal-loading"><div className="meal-loading-spinner" />Cooking up ideas…</div>}
        {!loading && generated && (
          <div className="meal-grid">
            {recipes.map((r, i) => (
              <div key={r.name} className="meal-card" style={{ animationDelay: `${i * 0.07}s` }} onClick={() => setSelectedRecipe(r)}>
                <span className="meal-card-emoji">{r.emoji}</span>
                <div className="meal-card-name">{r.name}</div>
                <div className="meal-card-desc">{r.desc}</div>
                <div className="meal-card-tags"><span className="meal-tag uses">Uses your stock</span><span className="meal-tag time">⏱ {r.time}</span><span className="meal-tag diff">{r.diff}</span></div>
                <div className="meal-card-footer"><span className="meal-card-stat">🔥 {r.cals}</span><button className="meal-try-btn">Try This →</button></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}