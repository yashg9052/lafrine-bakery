// src/services/api.js
// All AJAX calls using axios
// Base URL proxied to http://localhost:5000 via package.json proxy

import axios from "axios"

const API = axios.create({ baseURL: '/api' });

// ── MENU ──────────────────────────────────────────────────
// GET  /api/menu          → fetch all menu items
// GET  /api/menu?cat=bread → filter by category
export const getMenuItems = (cat = 'all') =>
  API.get(`/menu${cat !== 'all' ? `?cat=${cat}` : ''}`);

// ── LAST MINUTE SALE ─────────────────────────────────────
// GET  /api/sale          → fetch current sale items (cancelled orders)
export const getSaleItems = () => API.get('/sale');

// ── ORDERS ───────────────────────────────────────────────
// POST /api/orders        → place new order
// Body: { customer, items, orderType, pickupTime, notes, payment }
export const placeOrder = (payload) => API.post('/orders', payload);

// GET  /api/orders/:id    → get order status
export const getOrderById = (id) => API.get(`/orders/${id}`);

// ── PAYMENT ──────────────────────────────────────────────
// POST /api/payment/initiate  → initiate payment
// Body: { orderId, amount, method, isPartial, partialAmount }
export const initiatePayment = (payload) => API.post('/payment/initiate', payload);

// POST /api/payment/verify    → verify payment (mock)
// Body: { paymentId, orderId }
export const verifyPayment = (payload) => API.post('/payment/verify', payload);

// ── GEO ──────────────────────────────────────────────────
// GET  /api/bakery/location   → get bakery coordinates
export const getBakeryLocation = () => API.get('/bakery/location');

export default API;
