// src/components/Hero.jsx
import React from 'react';

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #3b2412 0%, #5c3420 60%, #7a4a2a 100%)',
    padding: 'clamp(3rem, 8vw, 5rem) 1.5rem clamp(2.5rem, 6vw, 4rem)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  inner: { position: 'relative', zIndex: 1 },
  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
    fontWeight: 900,
    color: '#fffdf9',
    lineHeight: 1.1,
    marginBottom: '0.5rem',
  },
  em: { color: '#e8a94b', fontStyle: 'italic' },
  p: { color: '#d4b896', fontSize: '1.05rem', marginTop: '0.8rem', maxWidth: '480px', margin: '0.8rem auto 0' },
  btns: { marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
};

export default function Hero({ onExplore, onOrder }) {
  return (
    <section style={styles.hero}>
      <div style={styles.pattern} />
      <div style={styles.inner}>
        <h1 style={styles.h1}>
          Baked with <em style={styles.em}>Love</em>,<br />Served with Soul
        </h1>
        <p style={styles.p}>
          Freshly crafted pastries, breads &amp; cakes — made every morning from the finest ingredients.
        </p>
        <div style={styles.btns}>
          <button className="btn btn-primary" onClick={onExplore}>Explore Menu</button>
          <button className="btn btn-outline" onClick={onOrder}>Place Order</button>
        </div>
      </div>
    </section>
  );
}
