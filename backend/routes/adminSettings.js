// backend/routes/adminSettings.js
const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const Dispute = require('../models/Dispute');
const Cancellation = require('../models/Cancellation');

// GET all booking management data
router.get('/booking-management', async (req, res) => {
  try {
    // Disable caching for this endpoint
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const [bookings, disputes, cancellations] = await Promise.all([
      Booking.find()
        .populate('customerId', 'name email phone')
        .populate('providerId', 'name email phone')
        .populate('serviceId', 'name price'),
      Dispute.find()
        .populate('bookingId')
        .populate('customerId', 'name email')
        .populate('providerId', 'name email'),
      Cancellation.find()
        .populate('bookingId')
        .populate('customerId', 'name email')
        .populate('providerId', 'name email')
    ]);

    res.json({
      success: true,
      bookings,
      disputes,
      cancellations,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching booking management data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Update booking status
router.patch('/booking/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('customerId providerId serviceId');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Resolve dispute
router.patch('/dispute/:id/resolve', async (req, res) => {
  try {
    const { status } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('bookingId customerId providerId');

    if (!dispute) {
      return res.status(404).json({ 
        success: false,
        message: "Dispute not found" 
      });
    }

    res.json({
      success: true,
      dispute
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Process cancellation
router.patch('/cancellation/:id/process', async (req, res) => {
  try {
    const { status } = req.body;
    const cancellation = await Cancellation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('bookingId customerId providerId');

    if (!cancellation) {
      return res.status(404).json({ 
        success: false,
        message: "Cancellation not found" 
      });
    }

    // Update booking status if approved
    if (status === 'approved') {
      await Booking.findByIdAndUpdate(
        cancellation.bookingId._id, 
        { status: 'cancelled' }
      );
    }

    res.json({
      success: true,
      cancellation
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

module.exports = router;