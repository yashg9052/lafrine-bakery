// src/App.jsx
import  { useCallback } from 'react';
import './App.css';
import useCart from './hooks/useCart';
import Header      from './components/Header';
import Hero        from './components/Hero';
import Menu        from './components/Menu';
import LastMinuteSale from './components/LastMinuteSale';
import OrderForm   from './components/OrderForm';
import GeoSection  from './components/GeoSection';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:'smooth' });
}

export default function App() {
  const { cart, addItem, removeItem, clearCart, total } = useCart();

  const handleAdd = useCallback((item) => {
    addItem(item);
  }, [addItem]);

  return (
    <div>
      <Header cartCount={cart.length} onNavClick={scrollTo} />
      <Hero onExplore={() => scrollTo('menu')} onOrder={() => scrollTo('order')} />
      <Menu onAddToCart={handleAdd} />
      <LastMinuteSale onAddToCart={handleAdd} />
      <OrderForm
        cart={cart}
        total={total}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />
      <GeoSection />

      <footer style={{
        background:'#3b2412', color:'#c9a88a',
        textAlign:'center', padding:'2rem 1rem', fontSize:'0.82rem',
      }}>
        <strong style={{ color:'#e8a94b', fontFamily:"'Playfair Display', serif" }}>La Farine</strong>
        {' '}· Artisan Bakery · Mumbai, India
        <div style={{ fontSize:'0.78rem', opacity:0.7, marginTop:'4px' }}>
          Built with React · Axios (AJAX) · CSS3 · Geolocation API
        </div>
      </footer>
    </div>
  );
}
