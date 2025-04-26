const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Adjust the path if needed

// POST: Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// You can add GET/DELETE routes later as needed

module.exports = router;
