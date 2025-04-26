const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User'); // if you want to include users
const { isAdmin } = require('../middleware/authMiddleware');

// GET /api/admin/dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const providers = await Provider.find().sort({ createdAt: -1 });
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      bookingsCount: bookings.length,
      providersCount: providers.length,
      subscribersCount: subscribers.length,
      usersCount: users.length,
      bookings,
      providers,
      subscribers,
      users
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
