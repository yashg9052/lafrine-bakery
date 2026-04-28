// src/components/LastMinuteSale.jsx
import { useState, useEffect } from 'react';
import { getSaleItems } from '../services/api';

const STATIC_SALE = [
  { _id:'s1', name:'Opera Cake (Whole)',  originalPrice:560, salePrice:280, image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', expiresAt: Date.now() + 3600000 },
  { _id:'s2', name:'Sourdough Loaf',      originalPrice:280, salePrice:140, image:'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80', expiresAt: Date.now() + 5400000 },
  { _id:'s3', name:'Carrot Cake Slice',   originalPrice:480, salePrice:200, image:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', expiresAt: Date.now() + 1800000 },
];

function Countdown({ expiresAt }) {
  const [left, setLeft] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, expiresAt - Date.now())), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const h = String(Math.floor(left / 1000 / 3600)).padStart(2,'0');
  const m = String(Math.floor((left / 1000 / 60) % 60)).padStart(2,'0');
  const s = String(Math.floor((left / 1000) % 60)).padStart(2,'0');

  return (
    <span style={{ fontFamily:'monospace', color:'#c0392b', fontWeight:700, fontSize:'0.95rem' }}>
      {h}:{m}:{s}
    </span>
  );
}

const st = {
  section: { background:'#fff3f0', borderTop:'1px solid #e0d0be', borderBottom:'1px solid #e0d0be' },
  inner: { maxWidth:'1100px', margin:'0 auto', padding:'3rem 1.5rem' },
  banner: {
    background:'linear-gradient(135deg, #a8452a, #c2813a)',
    borderRadius:'4px', padding:'1rem 1.5rem',
    display:'flex', alignItems:'center', gap:'1rem',
    marginBottom:'2rem', flexWrap:'wrap',
  },
  bannerText: { color:'#fff', fontFamily:"'Playfair Display', serif", fontSize:'1.3rem', fontWeight:700 },
  bannerSub: { color:'rgba(255,255,255,0.85)', fontSize:'0.85rem', marginTop:'2px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.5rem' },
  card: {
    background:'#fff9f2', border:'1.5px solid #f0c0b0',
    borderRadius:'4px', overflow:'hidden',
    display:'flex', flexDirection:'column',
  },
  imgWrap: { height:'160px', overflow:'hidden', position:'relative' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  saleBadge: {
    position:'absolute', top:'10px', left:'10px',
    background:'#c0392b', color:'#fff',
    fontSize:'0.75rem', fontWeight:700, padding:'3px 9px', borderRadius:'20px',
    letterSpacing:'0.5px', textTransform:'uppercase',
  },
  body: { padding:'1rem 1.1rem', flex:1, display:'flex', flexDirection:'column', gap:'0.4rem' },
  name: { fontFamily:"'Playfair Display', serif", fontSize:'1rem', fontWeight:700, color:'#3b2412' },
  priceRow: { display:'flex', alignItems:'center', gap:'0.6rem' },
  original: { color:'#999', fontSize:'0.85rem', textDecoration:'line-through' },
  sale: { color:'#c0392b', fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', fontWeight:700 },
  footer: { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'0.8rem' },
  grabBtn: {
    background:'#a8452a', color:'#fff', border:'none',
    padding:'0.4rem 1rem', borderRadius:'2px', fontSize:'0.8rem',
    fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
    transition:'background .2s',
  },
  empty: { color:'#7a5c44', fontStyle:'italic', textAlign:'center', padding:'2rem 0' },
};

export default function LastMinuteSale({ onAddToCart }) {
  const [items, setItems]     = useState(STATIC_SALE);
  const [loading, setLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    getSaleItems()
      .then(res => {
        const data = res.data.items || res.data;
        setItems(Array.isArray(data) ? data : STATIC_SALE);
      })
      .catch(() => setItems(STATIC_SALE))
      .finally(() => setLoading(false)); // ← only setState inside callback, not sync
  }, []);

  // Auto-refresh every 2 min (silent, no loading state)
  useEffect(() => {
    const t = setInterval(() => {
      getSaleItems()
        .then(res => {
          const data = res.data.items || res.data;
          setItems(Array.isArray(data) ? data : STATIC_SALE);
        })
        .catch(() => {});
    }, 120000);
    return () => clearInterval(t);
  }, []);

  return (
    <div id="sale" style={st.section}>
      <div style={st.inner}>
        <p className="section-title" style={{ color:'#a8452a' }}>Last Minute Sale</p>
        <hr className="divider" />
        <p className="section-sub">Cancelled orders — fresh stock, heavily discounted. Grab before it's gone!</p>

        <div style={st.banner}>
          <div>
            <div style={st.bannerText}>Today's Flash Sale</div>
            <div style={st.bannerSub}>Items from cancelled orders — same freshness, half the price</div>
          </div>
        </div>

        {loading && <p style={st.empty}>Loading sale items...</p>}
        {!loading && items.length === 0 && <p style={st.empty}>No sale items right now. Check back soon!</p>}

        <div style={st.grid}>
          {!loading && items.map(item => (
            <div key={item._id} style={st.card}>
              <div style={st.imgWrap}>
                <img src={item.image} alt={item.name} style={st.img} loading="lazy" />
                <span style={st.saleBadge}>
                  -{Math.round(100 - (item.salePrice / item.originalPrice) * 100)}% OFF
                </span>
              </div>
              <div style={st.body}>
                <div style={st.name}>{item.name}</div>
                <div style={st.priceRow}>
                  <span style={st.original}>₹{item.originalPrice}</span>
                  <span style={st.sale}>₹{item.salePrice}</span>
                </div>
                <div style={st.footer}>
                  <span style={{ fontSize:'0.78rem', color:'#7a5c44' }}>
                    Expires in: <Countdown expiresAt={item.expiresAt} />
                  </span>
                  <button
                    style={st.grabBtn}
                    onClick={() => onAddToCart({ ...item, price: item.salePrice })}
                    onMouseOver={e => e.target.style.background='#c2813a'}
                    onMouseOut={e => e.target.style.background='#a8452a'}
                  >
                    Grab Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}