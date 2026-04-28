// src/components/Header.jsx
import React from 'react';

const styles = {
  header: {
    background: '#3b2412',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '68px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.7rem',
    fontWeight: 900,
    color: '#e8a94b',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoSub: {
    fontSize: '1rem',
    fontWeight: 400,
    color: '#d4b896',
    fontStyle: 'italic',
  },
  nav: { display: 'flex', gap: '1.5rem' },
  navLink: {
    color: '#d4b896',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    transition: 'color .2s',
    cursor: 'pointer',
  },
  cartBadge: {
    background: '#e8a94b',
    color: '#3b2412',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginLeft: '6px',
  },
};

export default function Header({ cartCount, onNavClick }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        La Farine <span style={styles.logoSub}>Artisan Bakery</span>
      </div>
      <nav style={styles.nav}>
        {['menu', 'order', 'sale', 'find-us'].map(id => (
          <a
            key={id}
            style={styles.navLink}
            onClick={() => onNavClick(id)}
            onMouseOver={e => e.target.style.color = '#e8a94b'}
            onMouseOut={e => e.target.style.color = '#d4b896'}
          >
            {id === 'find-us' ? 'Find Us' : id.charAt(0).toUpperCase() + id.slice(1)}
            {id === 'order' && cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </a>
        ))}
      </nav>
    </header>
  );
}
