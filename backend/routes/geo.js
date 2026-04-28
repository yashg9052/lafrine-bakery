// routes/geo.js - Geo location API endpoints
import express from 'express';

const router = express.Router();

/**
 * GET /api/bakery/location
 * Get bakery's geographic location (coordinates for map)
 * 
 * POSTMAN TEST:
 * GET http://localhost:5000/api/bakery/location
 */
router.get('/location', (req, res) => {
  try {
    res.json({
      success: true,
      bakery: {
        name: 'La Farine Artisan Bakery',
        address: '123 Bread Street, Pastry Lane, The Flour District',
        phone: '+91-9876543210',
        email: 'hello@lafarine.com',
        coordinates: {
          latitude: 28.7041,
          longitude: 77.1025,
        },
        hours: {
          mon_fri: '08:00 - 20:00',
          saturday: '09:00 - 21:00',
          sunday: '10:00 - 19:00',
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
