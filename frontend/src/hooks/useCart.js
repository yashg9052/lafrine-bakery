// src/hooks/useCart.js
import { useState, useCallback } from 'react';

export default function useCart() {
  const [cart, setCart] = useState([]);

  const addItem = useCallback((item) => {
    setCart(prev => [...prev, { ...item, cartKey: Date.now() }]);
  }, []);

  const removeItem = useCallback((cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  return { cart, addItem, removeItem, clearCart, total };
}
