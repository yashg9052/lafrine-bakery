// src/components/Menu.jsx
import { useState, useEffect } from 'react';
import { getMenuItems } from '../services/api';

const STATIC_MENU = [
  { _id:'1', name:'Sourdough Loaf',     cat:'bread',  price:280, tag:'',    desc:'Long-fermented, crispy crust, chewy crumb. A daily staple.',
    image:'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80' },
  { _id:'2', name:'Multigrain Boule',   cat:'bread',  price:260, tag:'',    desc:'Seven grains, nutty flavour, dense & satisfying.',
    image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { _id:'3', name:'Garlic Focaccia',    cat:'bread',  price:220, tag:'new', desc:'Sea salt, rosemary, roasted garlic. Italian perfection.',
    image:'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&q=80' },
  { _id:'4', name:'Butter Croissant',   cat:'pastry', price:120, tag:'',    desc:'72-hour lamination. Shatters on first bite.',
    image:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
  { _id:'5', name:'Almond Tart',        cat:'pastry', price:180, tag:'',    desc:'Frangipane filling, toasted almonds, crisp shell.',
    image:'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=80' },
  { _id:'6', name:'Pain au Chocolat',   cat:'pastry', price:150, tag:'new', desc:'Dark chocolate batons wrapped in buttery pastry.',
    image:'/pain_au.jpg' },
  { _id:'7', name:'Strawberry Éclair',  cat:'pastry', price:165, tag:'',    desc:'Choux pastry, diplomat cream, fresh strawberry glaze.',
    image:'https://images.unsplash.com/photo-1612203985729-70726954388c?w=400&q=80' },
  { _id:'8', name:'Carrot Cake',        cat:'cake',   price:480, tag:'',    desc:'Three layers, cream cheese frosting, candied walnuts.',
    image:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80' },
  { _id:'9', name:'Lemon Drizzle',      cat:'cake',   price:420, tag:'',    desc:'Zingy & moist, topped with lemon curd and citrus icing.',
    image:'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80' },
  { _id:'10',name:'Opera Cake',         cat:'cake',   price:560, tag:'new', desc:'Coffee buttercream, ganache, almond joconde layers.',
    image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80' },
  { _id:'11',name:'Cafe Latte',         cat:'drink',  price:140, tag:'',    desc:'Double shot espresso, steamed whole milk, light foam.',
    image:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80' },
  { _id:'12',name:'Fresh Orange Juice', cat:'drink',  price:120, tag:'',    desc:'Cold-pressed, pulpy, pure Valencia orange juice.',
    image:'/orange_juice.jpg' },
];

const CATS = ['all','bread','pastry','cake','drink'];

const s = {
  tabs: { display:'flex', gap:'0.5rem', marginBottom:'2rem', flexWrap:'wrap' },
  tabBtn: (active) => ({
    padding:'0.5rem 1.2rem',
    background: active ? '#3b2412' : 'transparent',
    border: `1.5px solid ${active ? '#3b2412' : '#e0d0be'}`,
    color: active ? '#e8a94b' : '#7a5c44',
    fontFamily:"'DM Sans', sans-serif",
    fontSize:'0.83rem', fontWeight:500, letterSpacing:'0.5px',
    textTransform:'uppercase', cursor:'pointer', borderRadius:'2px', transition:'all .2s',
  }),
  grid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
    gap:'1.5rem',
    width: '100%',
  },
  card: {
    background:'#fff9f2', border:'1px solid #e0d0be',
    borderRadius:'4px', overflow:'hidden',
    transition:'transform .2s, box-shadow .2s',
    display:'flex', flexDirection:'column',
    cursor:'default',
  },
  imgWrap: { height:'160px', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover', display:'block' },
  body: { padding:'1rem 1.1rem 1.2rem', flex:1, display:'flex', flexDirection:'column' },
  nameRow: { display:'flex', alignItems:'center', gap:'8px' },
  name: { fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#3b2412' },
  desc: { fontSize:'0.82rem', color:'#7a5c44', margin:'0.35rem 0 auto', lineHeight:1.5 },
  footer: { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1rem' },
  price: { fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#c2813a' },
  addBtn: {
    background:'#3b2412', color:'#e8a94b', border:'none',
    padding:'0.4rem 0.9rem', borderRadius:'2px', fontSize:'0.8rem',
    fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
  },
  loading: { textAlign:'center', color:'#7a5c44', padding:'3rem 0', gridColumn:'1/-1' },
};

export default function Menu({ onAddToCart }) {
  const [cat, setCat]         = useState('all');
  const [items, setItems]     = useState(STATIC_MENU);
  const [loading, setLoading] = useState(true); // ← init true, no sync setState in effect

  useEffect(() => {
    // no setLoading(true) here — cat change re-runs effect, items update in callbacks only
    getMenuItems(cat)
      .then(res => {
        const data = res.data.items || res.data;
        setItems(Array.isArray(data) ? data : STATIC_MENU);
      })
      .catch(() => {
        const filtered = cat === 'all' ? STATIC_MENU : STATIC_MENU.filter(i => i.cat === cat);
        setItems(filtered);
      })
      .finally(() => setLoading(false)); // ← setState only inside callback, never sync
  }, [cat]);

  const handleCatChange = (c) => {
    setItems([]);   // clear previous items instantly on tab click
    setCat(c);      // triggers useEffect re-run
  };

  return (
    <section id="menu" className="section">
      <p className="section-title">Our Menu</p>
      <hr className="divider" />
      <p className="section-sub">Everything baked fresh daily — no preservatives, ever.</p>

      <div style={s.tabs}>
        {CATS.map(c => (
          <button key={c} style={s.tabBtn(cat === c)} onClick={() => handleCatChange(c)}>
            {c === 'all' ? 'All Items' : c.charAt(0).toUpperCase() + c.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div style={s.grid}>
        {(loading || items.length === 0) && <p style={s.loading}>Loading menu...</p>}
        {!loading && items.map(item => (
          <div
            key={item._id}
            style={s.card}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(59,36,18,0.10)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={s.imgWrap}>
              <img src={item.image} alt={item.name} style={s.img} loading="lazy" />
            </div>
            <div style={s.body}>
              <div style={s.nameRow}>
                <span style={s.name}>{item.name}</span>
                {item.tag && <span className={`badge ${item.tag === 'new' ? 'tag-new' : ''}`}>{item.tag}</span>}
              </div>
              <p style={s.desc}>{item.desc}</p>
              <div style={s.footer}>
                <span style={s.price}>₹{item.price}</span>
                <button
                  style={s.addBtn}
                  onClick={() => onAddToCart(item)}
                  onMouseOver={e => e.target.style.background='#c2813a'}
                  onMouseOut={e => e.target.style.background='#3b2412'}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}