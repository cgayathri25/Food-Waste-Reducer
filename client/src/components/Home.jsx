import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HOME_CSS = `
    /* ══ BASE STYLES ══ */
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    
    #home-root {
        font-family:'Outfit',sans-serif;
        background:#f6faf7; color:#0f1f12;
        overflow-x:hidden; cursor:none;
        min-height: 100vh; position: relative;
    }

    #home-root #cur-dot {
        position:fixed; width:12px; height:12px; border-radius:50%;
        background:#2d8a5d; pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%); mix-blend-mode:multiply;
        transition:width .2s, height .2s, background .2s;
    }
    #home-root #cur-ring {
        position:fixed; width:40px; height:40px; border-radius:50%;
        border:1.5px solid rgba(45,138,93,.45); pointer-events:none; z-index:9998;
        transform:translate(-50%,-50%);
    }
    #home-root #trail-canvas { position:fixed; inset:0; pointer-events:none; z-index:9997; }
    #home-root.chover #cur-dot { width:18px; height:18px; background:#1b5e20; }
    #home-root.clink #cur-dot { background:#f59e0b; width:14px; height:14px; }

    /* ══ NAVIGATION ══ */
    #home-root nav {
        position:fixed; top:0; left:0; right:0; z-index:500;
        display:flex; justify-content:space-between; align-items:center;
        padding:20px 64px; background:rgba(246,250,247,.88);
        -webkit-backdrop-filter:blur(24px); backdrop-filter:blur(24px);
        border-bottom:1px solid rgba(45,138,93,.07);
        transform:translateY(-110%);
        animation:navDrop .8s .15s cubic-bezier(.23,1,.32,1) forwards;
    }
    @keyframes navDrop { to{transform:translateY(0);} }
    #home-root .nav-logo { font-family:'Playfair Display',serif; font-weight:700; font-size:1.15rem; color:#2d8a5d; text-decoration: none; }
    #home-root nav ul { list-style:none; display:flex; gap:4px; align-items:center; }
    #home-root nav ul li a { text-decoration:none; color:#4a6741; font-weight:500; font-size:.88rem; padding:8px 15px; border-radius:100px; transition:all .22s; cursor:none; }
    #home-root nav ul li a:hover { background:rgba(45,138,93,.09); color:#2d8a5d; }
    #home-root .nav-links-list .active { color: #2d8a5d; background: rgba(45,138,93,.09); }
    #home-root .login-btn { background:#2d8a5d!important; color:#fff!important; padding:9px 22px!important; box-shadow:0 4px 18px rgba(45,138,93,.3); }

    /* ══ PROFILE DROPDOWN ══ */
    .profile-container { position: relative; }
    .profile-menu {
        position: absolute; top: 50px; right: 0;
        background: #fff; border-radius: 16px;
        width: 180px; padding: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border: 1px solid rgba(45,138,93,0.08);
        z-index: 1000; display: none;
    }
    .profile-menu.show { display: block; animation: menuFade 0.2s ease forwards; }
    @keyframes menuFade { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
    
    .menu-item {
        padding: 12px 16px; font-size: 0.85rem; font-weight: 500;
        color: #4a6741; border-radius: 10px; cursor: none;
        transition: all 0.2s; text-align: left;
    }
    .menu-item:hover { background: rgba(45,138,93,0.09); color: #2d8a5d; }
    .menu-item.logout { color: #ef4444; }
    .menu-item.logout:hover { background: #fee2e2; }

    /* ══ HERO SECTION ══ */
    #home-root .hero {
        min-height:100vh; display:grid; grid-template-columns:1fr 1fr;
        align-items:center; padding:130px 64px 90px; gap:60px;
        position:relative; overflow:hidden;
    }
    #home-root .hero-bg {
        position:absolute; inset:0; pointer-events:none;
        background-image:radial-gradient(circle, rgba(45,138,93,.18) 1.5px, transparent 1.5px);
        background-size:36px 36px; animation:bgDrift 30s linear infinite;
    }
    @keyframes bgDrift { 100%{background-position:36px 36px} }
    #home-root .hero-left { position:relative; z-index:2; }
    #home-root .eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:.74rem; font-weight:600; letter-spacing:2.4px; text-transform:uppercase; color:#2d8a5d; margin-bottom:28px; opacity:0; }
    #home-root .eyebrow-dash { width:28px; height:1.5px; background:#74c69d; }
    #home-root h1 { font-family:'Playfair Display',serif; font-size:clamp(3rem,4.6vw,5.2rem); font-weight:900; line-height:1.04; color:#0f1f12; margin-bottom:28px; letter-spacing:-2px; opacity:0; }
    #home-root h1 em { font-style:italic; color:#2d8a5d; }
    #home-root .swap { display:inline-block; overflow:hidden; vertical-align:bottom; height:1.1em; position:relative; }
    #home-root .swap-inner { display:flex; flex-direction:column; animation:swapCycle 6s steps(1) infinite; }
    #home-root .swap-inner span { display:block; color:#74c69d; font-style:italic; }
    @keyframes swapCycle { 0%, 100% {transform:translateY(0)} 33% {transform:translateY(-1.1em)} 66% {transform:translateY(-2.2em)} }
    #home-root .hero-desc { font-size:1.06rem; color:#4a6741; line-height:1.82; max-width:460px; margin-bottom:42px; opacity:0; }
    #home-root .cta-row { display:flex; gap:14px; opacity:0; }
    #home-root .btn-p { background:#2d8a5d; color:#fff; padding:16px 36px; border:none; border-radius:100px; font-weight:600; cursor:none; box-shadow:0 8px 28px rgba(45,138,93,.35); }
    #home-root .btn-o { background:transparent; color:#2d8a5d; padding:16px 36px; border:1.5px solid rgba(45,138,93,.35); border-radius:100px; font-weight:600; cursor:none; }
    #home-root .pill-row { display:flex; gap:10px; margin-top:48px; }
    #home-root .pill { background:#fff; border:1px solid rgba(45,138,93,.12); border-radius:100px; padding:10px 18px; font-size:.82rem; cursor:none; opacity:0; }
    @keyframes riseIn { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }

    /* ══ CARDS ══ */
    #home-root .cards-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; position:relative; z-index:2; }
    #home-root .feat-card { background:#fff; border-radius:24px; padding:26px 22px; border:1px solid rgba(45,138,93,.08); box-shadow:0 6px 24px rgba(0,0,0,.05); cursor:none; transition: all 0.2s ease-out; }
    #home-root .feat-card.tall { grid-row:span 2; display:flex; flex-direction:column; }
    #home-root .feat-card.accent { background:linear-gradient(148deg,#2d8a5d,#1b5e20); color:#fff; border:none; }
    #home-root .big-stat { font-family:'Playfair Display',serif; font-size:4rem; font-weight:900; color:#2d8a5d; margin:14px 0 4px; }
    #home-root .feat-card.accent .big-stat { color:#fff; }
    #home-root .feat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }

    /* ══ SECTIONS ══ */
    #home-root .reveal { opacity:0; transform:translateY(38px); transition:all .75s cubic-bezier(.23,1,.32,1); }
    #home-root .reveal.visible { opacity:1; transform:translateY(0); }
    #home-root .impact-section { padding:110px 64px; }
    #home-root .impact-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; max-width:900px; margin:52px auto 0; }
    #home-root .impact-card { padding:44px 32px; border-radius:26px; background:#fff; border:1px solid rgba(45,138,93,.08); text-align:center; transition:0.3s; cursor:none; }
    #home-root .imp-num { font-family:'Playfair Display',serif; font-size:3rem; font-weight:900; color:#2d8a5d; }
    #home-root footer { background:#0c1a10; color:rgba(255,255,255,.4); text-align:center; padding:38px 64px; }
`;

export default function Home() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const cached = parseInt(localStorage.getItem("cachedCount")) || 0;
    const [counts, setCounts] = useState({ waste: 0, savings: 0, meals: 0, kitchen: cached });
    const [dbCount, setDbCount] = useState(cached);

    useEffect(() => {
        const styleId = "home-scoped-styles";
        let styleTag = document.getElementById(styleId);
        if (styleTag) styleTag.remove();
        styleTag = document.createElement('style');
        styleTag.id = styleId; styleTag.textContent = HOME_CSS;
        document.head.appendChild(styleTag);

        const fetchRealStats = async () => {
            try {
                const userId = localStorage.getItem("dbUserId");
                if (!userId) return;

                const response = await fetch(`http://localhost:8000/api/inventory/${userId}`);
                const data = await response.json();
                
                const actualLength = Array.isArray(data) ? data.length : 0;
                
                setDbCount(actualLength);
                localStorage.setItem("cachedCount", actualLength);
                setCounts(prev => ({ ...prev, kitchen: actualLength }));
            } catch (err) { console.error("Home fetch error:", err); }
        };
        fetchRealStats();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const TRAIL = [], MAX = 32;
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        const handleMove = (e) => {
            mx = e.clientX; my = e.clientY;
            if (dotRef.current) { dotRef.current.style.left = mx + 'px'; dotRef.current.style.top = my + 'px'; }
            const el = document.elementFromPoint(mx, my);
            const root = document.getElementById('home-root');
            root?.classList.toggle('chover', !!el?.closest('.feat-card, .impact-card, .pill, .profile-container, .menu-item'));
            root?.classList.toggle('clink', !!el?.closest('a, button'));
        };
        window.addEventListener('mousemove', handleMove);

        const draw = () => {
            rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
            if (ringRef.current) { ringRef.current.style.left = rx + 'px'; ringRef.current.style.top = ry + 'px'; }
            TRAIL.push({ x: mx, y: my }); if (TRAIL.length > MAX) TRAIL.shift();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (TRAIL.length > 2) {
                ctx.beginPath(); ctx.moveTo(TRAIL[0].x, TRAIL[0].y);
                for (let i = 1; i < TRAIL.length - 1; i++) {
                    const cpx = (TRAIL[i].x + TRAIL[i + 1].x) / 2, cpy = (TRAIL[i].y + TRAIL[i + 1].y) / 2;
                    ctx.quadraticCurveTo(TRAIL[i].x, TRAIL[i].y, cpx, cpy);
                }
                ctx.strokeStyle = 'rgba(45,138,93,0.2)'; ctx.lineWidth = 2.5; ctx.stroke();
            }
            requestAnimationFrame(draw);
        };
        draw();

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const startTime = performance.now();
                    const step = (now) => {
                        const progress = Math.min((now - startTime) / 1000, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        setCounts(p => ({ 
                            waste: Math.round(ease * 94), 
                            savings: Math.round(ease * 840), 
                            meals: Math.round(ease * 12), 
                            kitchen: dbCount > 0 ? Math.round(ease * dbCount) : p.kitchen 
                        }));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            });
        }, { threshold: 0.14 });
        document.querySelectorAll('#home-root .reveal').forEach(el => observer.observe(el));

        const startAnims = () => {
            const hE = document.getElementById('heroEyebrow');
            const hH = document.getElementById('heroH1');
            const hD = document.getElementById('heroDesc');
            const hC = document.getElementById('heroCTA');
            if(hE) hE.style.animation = "riseIn .55s .25s ease forwards";
            if(hH) hH.style.animation = "riseIn .6s .35s ease forwards";
            if(hD) hD.style.animation = "riseIn .6s .48s ease forwards";
            if(hC) hC.style.animation = "riseIn .6s .6s ease forwards";
            document.querySelectorAll('#home-root .pill').forEach((p, i) => p.style.animation = `riseIn .5s ${0.72 + i * 0.08}s ease both`);
        };
        setTimeout(startAnims, 100);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('resize', resize);
            if (styleTag) styleTag.remove();
        };
    }, [dbCount]); 

    const tilt = (e, card) => {
        const r = card.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
        card.style.transform = `perspective(900px) rotateX(${-(dy / (r.height / 2)) * 16}deg) rotateY(${(dx / (r.width / 2)) * 16}deg) scale(1.04)`;
    };

    const initial = localStorage.getItem("userInitial") || "G";
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    const handleAuthAction = () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("dbUserId");
        localStorage.removeItem("cachedCount");
        navigate("/");
    };

    return (
        <div id="home-root">
            <div id="cur-dot" ref={dotRef}></div>
            <div id="cur-ring" ref={ringRef}></div>
            <canvas id="trail-canvas" ref={canvasRef}></canvas>

            <nav>
                <Link to="/home" className="nav-logo">🌱 Food Waste Reducer</Link>
                <ul className="nav-links-list">
                    <li><Link to="/home" className="active">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/inventory">Inventory</Link></li>
                    <li><Link to="/meals">Meals</Link></li>
                    <li><Link to="/alerts">Alerts</Link></li>
                    <li><Link to="/food-share">Food Share</Link></li>
                    <li><Link to="/tips">Tips</Link></li>
                    {isLoggedIn ? (
                        <li className="profile-container">
                            <div 
                                style={{
                                    width:'38px', height:'38px', background:'#2d8a5d', color:'#fff', 
                                    borderRadius:'50%', display:'flex', alignItems:'center', 
                                    justifyContent:'center', fontWeight:'bold', cursor:'none', 
                                    marginLeft:'15px', border: '2px solid #e4f5ec'
                                }} 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                {initial}
                            </div>
                            <div className={`profile-menu ${showProfileMenu ? 'show' : ''}`}>
                                <div className="menu-item" onClick={handleAuthAction}>Switch Account</div>
                                <div className="menu-item logout" onClick={handleAuthAction}>Logout</div>
                            </div>
                        </li>
                    ) : (
                        <li><Link to="/" className="login-btn">Login</Link></li>
                    )}
                </ul>
            </nav>

            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-left">
                    <div className="eyebrow" id="heroEyebrow"><div className="eyebrow-dash"></div>Live in Hyderabad</div>
                    <h1 id="heroH1">Waste <em>Less.</em><br/>Eat <span className="swap"><span className="swap-inner"><span>Smarter.</span><span>Better.</span><span>Greener.</span></span></span><br/>Live Well.</h1>
                    <p className="hero-desc" id="heroDesc">Track groceries, get recipe ideas with the items in your inventory, and share surplus food with your community.</p>
                    <div className="cta-row" id="heroCTA">
                        <button className="btn-p" onClick={() => navigate('/inventory')}>Get Started by adding to Inventory →</button>
                        <button className="btn-o" onClick={() => navigate('/how-it-works')}>How It Works</button>
                    </div>
                    <div className="pill-row">
                        <div className="pill"><span style={{color:'#2d8a5d', fontWeight:700}}>94%</span><span> less waste</span></div>
                        <div className="pill"><span style={{color:'#2d8a5d', fontWeight:700}}>₹840</span><span> monthly savings</span></div>
                    </div>
                </div>

                <div className="cards-grid">
                    <div className="feat-card tall accent" 
                        onClick={() => navigate('/dashboard')}
                        onMouseMove={(e) => tilt(e, e.currentTarget)} 
                        onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                        <div className="feat-title">Stock Analytics</div>
                        <p>Real-time overview of your kitchen quantities.</p>
                        <div className="big-stat">{counts.kitchen}</div>
                        <div style={{fontSize:'.7rem', opacity:.7}}>Items Tracked</div>
                        <div style={{color:'#fff', textDecoration:'none', fontSize:'.8rem', marginTop:'auto', cursor: 'none'}}>View Dashboard →</div>
                    </div>

                    <div className="feat-card" 
                        onClick={() => navigate('/alerts')}
                        onMouseMove={(e) => tilt(e, e.currentTarget)} 
                        onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                        <div className="feat-title">Expiry Alerts</div>
                        <p>Smart reminders before food expires.</p>
                        
                    </div>

                    <div className="feat-card" 
                        onClick={() => navigate('/meals')}
                        onMouseMove={(e) => tilt(e, e.currentTarget)} 
                        onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                        <div className="feat-title">Meal Planner</div>
                        <p>AI recipes from your current stock.</p>
                        
                    </div>
                </div>
            </section>

            <section className="impact-section reveal">
                <div className="impact-grid">
                    <div className="impact-card"><div className="imp-num">{counts.waste}%</div><p>Users reporting less waste</p></div>
                    <div className="impact-card"><div className="imp-num">₹{counts.savings}</div><p>Avg. monthly savings</p></div>
                    <div className="impact-card"><div className="imp-num">{counts.meals}K</div><p>Meals shared locally</p></div>
                </div>
            </section>

            <footer>© 2026 <strong>Food Waste Reducer</strong> · Built for Sustainable Living 🌍</footer>
        </div>
    );
}