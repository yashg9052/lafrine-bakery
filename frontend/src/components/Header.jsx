// src/components/Header.jsx
import React, { useState } from 'react';

export default function Header({ cartCount, onNavClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ['menu', 'order', 'sale', 'find-us'];

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        La Farine <span style={styles.logoSub}>Artisan Bakery</span>
      </div>

      {/* Hamburger Button (mobile) */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span style={{
          ...styles.hamburgerLine,
          transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
        }} />
        <span style={{
          ...styles.hamburgerLine,
          opacity: menuOpen ? 0 : 1,
        }} />
        <span style={{
          ...styles.hamburgerLine,
          transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
        }} />
      </button>

      {/* Desktop Nav */}
      <nav style={styles.nav} className="desktop-nav">
        {navItems.map(id => (
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

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <nav style={styles.mobileNav}>
          {navItems.map(id => (
            <a
              key={id}
              style={styles.mobileNavLink}
              onClick={() => { onNavClick(id); setMenuOpen(false); }}
            >
              {id === 'find-us' ? 'Find Us' : id.charAt(0).toUpperCase() + id.slice(1)}
              {id === 'order' && cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </a>
          ))}
        </nav>
      )}

      {/* Inline responsive styles via <style> tag */}
      <style>{`
        .desktop-nav {
          display: flex;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          button[aria-label="Toggle navigation"] {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

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
    flexWrap: 'wrap',
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
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    zIndex: 110,
  },
  hamburgerLine: {
    display: 'block',
    width: '24px',
    height: '2px',
    background: '#e8a94b',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileNav: {
    position: 'absolute',
    top: '68px',
    left: 0,
    right: 0,
    background: '#3b2412',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 2rem 1.5rem',
    gap: '0.2rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    borderBottom: '2px solid #e8a94b',
    zIndex: 150,
    animation: 'slideDown 0.25s ease',
  },
  mobileNavLink: {
    color: '#d4b896',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '0.7rem 0',
    borderBottom: '1px solid rgba(212,184,150,0.15)',
    transition: 'color .2s',
  },
};
