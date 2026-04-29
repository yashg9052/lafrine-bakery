// src/components/GeoSection.jsx
import React, { useState } from 'react';

const BAKERY = { lat: 19.0544, lng: 72.8402 };

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const s = {
  wrap: { background:'#faf6ef', borderTop:'1px solid #e0d0be' },
  inner: { maxWidth:'1100px', margin:'0 auto', padding:'3rem 1.5rem' },
  card: { background:'#fff9f2', border:'1px solid #e0d0be', borderRadius:'4px', padding:'1.5rem' },
  mapPlaceholder: {
    width:'100%', height:'240px',
    background:'linear-gradient(135deg, #e8ddd0 0%, #d4c5b0 100%)',
    borderRadius:'3px', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', gap:'0.5rem',
    position:'relative', overflow:'hidden', border:'1px solid #e0d0be',
  },
  mapGrid: {
    position:'absolute', inset:0,
    backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.04) 30px, rgba(0,0,0,0.04) 31px),
                     repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.04) 30px, rgba(0,0,0,0.04) 31px)`,
  },
  pinLabel: { fontSize:'0.8rem', color:'#7a5c44', position:'relative', zIndex:2, textAlign:'center' },
  locateBtn: {
    width:'100%', textAlign:'center', background:'#e8a94b', color:'#3b2412',
    border:'none', padding:'0.7rem 1.8rem', borderRadius:'2px', fontSize:'0.88rem',
    fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer',
    marginTop:'1rem', fontFamily:"'DM Sans', sans-serif",
  },
  infoTitle: { fontFamily:"'Playfair Display', serif", color:'#3b2412', marginBottom:'0.8rem' },
  row: {
    display:'flex', gap:'0.6rem', alignItems:'flex-start',
    padding:'0.5rem 0.7rem', background:'#fff', border:'1px solid #e0d0be',
    borderRadius:'3px', fontSize:'0.85rem', marginBottom:'0.4rem',
  },
  rowKey: { color:'#3b2412', minWidth:'80px', fontWeight:600 },
  rowVal: { color:'#7a5c44', wordBreak:'break-word' },
};

const PIN_STYLE = {
  fontSize:'2.5rem', position:'relative', zIndex:2,
  animation:'bounce 1.5s infinite',
};

export default function GeoSection() {
  const [geo, setGeo]       = useState(null);
  const [status, setStatus] = useState('');

  const locate = () => {
    if (!navigator.geolocation) { setStatus('Geolocation not supported.'); return; }
    setStatus('Detecting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const dist = haversine(latitude, longitude, BAKERY.lat, BAKERY.lng);
        setGeo({ lat: latitude.toFixed(6), lng: longitude.toFixed(6), dist, acc: accuracy.toFixed(0) });
        setStatus('');
      },
      (err) => setStatus(err.code === 1 ? 'Permission denied. Enable location access.' : 'Could not get location.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div id="find-us" style={s.wrap}>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .geo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-top: 1rem;
        }
        @media (max-width: 768px) {
          .geo-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        @media (max-width: 480px) {
          .geo-grid {
            gap: 1rem;
          }
        }
      `}</style>
      <div style={s.inner}>
        <p className="section-title">Find Us</p>
        <hr className="divider" />
        <p className="section-sub">Visit us in-store or check how far we are from you.</p>

        <div className="geo-grid">
          <div style={s.card}>
            <div style={s.mapPlaceholder}>
              <div style={s.mapGrid} />
              <span style={PIN_STYLE}>📍</span>
              <div style={s.pinLabel}>La Farine Bakery<br /><small>Bandra West, Mumbai</small></div>
            </div>
            <button style={s.locateBtn} onClick={locate}
              onMouseOver={e => e.target.style.background='#c2813a'}
              onMouseOut={e => e.target.style.background='#e8a94b'}>
              Share My Location
            </button>
            {status && <p style={{ fontSize:'0.85rem', color:'#7a5c44', marginTop:'0.8rem' }}>{status}</p>}
          </div>

          <div style={s.card}>
            <div style={s.infoTitle}>Bakery Address</div>
            {[
              ['Address', '12, Hill Road, Bandra West, Mumbai 400050'],
              ['Hours', 'Mon–Sat: 7:00 AM – 8:00 PM | Sun: 8:00 AM – 5:00 PM'],
              ['Phone', '+91 98765 43210'],
              ['Email', 'hello@lafarine.in'],
            ].map(([k, v]) => (
              <div key={k} style={s.row}><strong style={s.rowKey}>{k}</strong><span style={s.rowVal}>{v}</span></div>
            ))}

            {geo && (
              <>
                <div style={{ ...s.infoTitle, marginTop:'1.5rem' }}>Your Location</div>
                {[
                  ['Latitude', geo.lat + '°'],
                  ['Longitude', geo.lng + '°'],
                  ['Distance', geo.dist < 1 ? `${(geo.dist * 1000).toFixed(0)} metres away` : `${geo.dist.toFixed(2)} km away`],
                  ['Accuracy', `±${geo.acc} m`],
                ].map(([k, v]) => (
                  <div key={k} style={s.row}><strong style={s.rowKey}>{k}</strong><span style={s.rowVal}>{v}</span></div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
