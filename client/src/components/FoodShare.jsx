import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { User, Calendar, Plus, X, Utensils, Bell, Mail } from 'lucide-react';

const SHARE_STYLES = `
  .share-body { position: relative; overflow-x: hidden; }
  
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

  .nav-back {
    position: fixed; top: 35px; left: 35px; z-index: 100;
    background: #2d8a5d; color: white; border: none;
    padding: 8px 16px; border-radius: 100px; font-weight: 600; 
    font-size: 0.8rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(45,138,93,0.2); transition: 0.3s;
  }
  .nav-back:hover { background: #1b5e20; transform: scale(1.05); }
  
  .content-layer { position: relative; z-index: 2; }
`;

const FoodShare = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ foodName: '', quantity: '', donor: '', expiry: '' });

  const fetchListings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/share/all');
      setListings(res.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => { 
    const s = document.createElement("style");
    s.textContent = SHARE_STYLES;
    document.head.appendChild(s);
    fetchListings(); 
    return () => s.remove();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listingData = { ...formData, donorId: localStorage.getItem("dbUserId") };
      await axios.post('http://localhost:8000/api/share/add', listingData);
      setFormData({ foodName: '', quantity: '', donor: '', expiry: '' });
      setShowForm(false);
      fetchListings();
      window.location.reload(); 
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to post.");
    }
  };

  const handleRequest = async (itemId) => {
    const requesterId = localStorage.getItem("dbUserId");
    if (!requesterId) { alert("Please login!"); return; }
    try {
      const res = await axios.put(`http://localhost:8000/api/share/request/${itemId}`, { requesterId });
      if (res.status === 200) { alert("Request sent!"); fetchListings(); }
    } catch (err) { console.error("Request failed", err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-24 share-body">
      {/* 8 Floating Decorations */}
      <div className="veg-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🥬</div>
      <div className="veg-float" style={{ top: '45%', right: '8%', animationDelay: '1.5s' }}>🍋</div>
      <div className="veg-float" style={{ bottom: '15%', left: '10%', animationDelay: '3s' }}>🌽</div>
      <div className="veg-float" style={{ top: '75%', right: '12%', animationDelay: '4.5s' }}>🍑</div>
      <div className="veg-float" style={{ top: '5%', right: '30%', animationDelay: '0.8s' }}>🍎</div>
      <div className="veg-float" style={{ bottom: '45%', left: '35%', animationDelay: '2.2s' }}>🥦</div>
      <div className="veg-float" style={{ top: '60%', left: '3%', animationDelay: '3.7s' }}>🍓</div>
      <div className="veg-float" style={{ bottom: '10%', right: '25%', animationDelay: '5.2s' }}>🥕</div>

      <button className="nav-back" onClick={() => navigate('/home')}>← Home</button>

      <div className="content-layer">
        <div className="max-w-6xl mx-auto flex justify-between items-end mb-10 pl-24">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Community Share</h1>
            <p className="text-gray-500 mt-2">Connecting surplus food with those who need it.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg">
            <Plus size={20} /> Share Surplus
          </button>
        </div>

        {/* Listings Grid (Forced Opaque White) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600"><Utensils size={24} /></div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.status === 'Claimed' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {item.status || 'Available'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{item.foodName}</h3>
              <p className="text-gray-500 text-sm mb-4">{item.quantity} available</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span>Donor: {item.donor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Expires: {item.expiry}</span>
                </div>
              </div>

              <button onClick={() => handleRequest(item._id)} disabled={item.status === 'Claimed'} className={`w-full py-3 rounded-xl font-medium transition-colors ${item.status === 'Claimed' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-black text-white'}`}>
                {item.status === 'Claimed' ? "Already Requested" : "Request Item"}
              </button>
            </div>
          ))}
        </div>

        {/* My Shared Items (Forced Opaque White) */}
        <div className="max-w-6xl mx-auto mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="bg-green-500 w-2 h-8 rounded-full"></div>
            My Shared Items & Activity
          </h2>

          <div className="space-y-4">
            {listings
              .filter(item => item.donorId === localStorage.getItem("dbUserId"))
              .map(item => (
                <div key={item._id} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-sm">
                  <div className="mb-4 md:mb-0">
                    <h4 className="font-bold text-lg text-gray-800">{item.foodName}</h4>
                    <p className="text-sm text-gray-500">Status: {item.status || 'Available'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.status === 'Claimed' ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl border border-blue-100">
                          <Bell size={18} className="animate-bounce" />
                          <span className="text-sm font-semibold">Requested by: {item.requester?.name || "User"}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg">Waiting for requests</span>
                    )}
                  </div>
                </div>
              ))}

            {/* Empty State Box (Forced Opaque White) */}
            {listings.filter(item => item.donorId === localStorage.getItem("dbUserId")).length === 0 && (
              <div className="text-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-3xl shadow-sm">
                <p className="text-gray-500 font-semibold text-lg">You haven't shared any surplus food yet.</p>
                <p className="text-gray-400 text-sm mt-1">Items you share will appear here for you to manage.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Opaque White */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Share Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="What are you sharing?" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" value={formData.foodName} onChange={(e) => setFormData({...formData, foodName: e.target.value})} required />
              <input type="text" placeholder="Quantity (e.g. 3 bowls)" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              <input type="text" placeholder="Your Name" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" value={formData.donor} onChange={(e) => setFormData({...formData, donor: e.target.value})} required />
              <input type="text" placeholder="Expiry Date/Time" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} required />
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg">Post Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodShare;