const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Dispute = require("../models/Dispute");
const Cancellation = require("../models/Cancellation");

// Get all bookings with filters
router.get("/bookings", async (req, res) => {
  try {
    const { status, customerId, providerId } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (providerId) query.providerId = providerId;
    
    const bookings = await Booking.find(query)
      .populate("customerId", "name email phone")
      .populate("providerId", "name email phone")
      .populate("serviceId", "name price");
      
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("customerId providerId serviceId");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all disputes
router.get("/disputes", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const disputes = await Dispute.find(query)
      .populate("bookingId")
      .populate("customerId", "name email")
      .populate("providerId", "name email");
      
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve dispute
router.patch("/disputes/:id/resolve", async (req, res) => {
  try {
    const { status } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("bookingId customerId providerId");
    
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });
    
    res.json(dispute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all cancellations
router.get("/cancellations", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const cancellations = await Cancellation.find(query)
      .populate("bookingId")
      .populate("customerId", "name email")
      .populate("providerId", "name email");
      
    res.json(cancellations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process cancellation
router.patch("/cancellations/:id/process", async (req, res) => {
  try {
    const { status } = req.body;
    const cancellation = await Cancellation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("bookingId customerId providerId");
    
    if (!cancellation) return res.status(404).json({ message: "Cancellation not found" });
    
    // Update booking status if approved
    if (status === "approved") {
      await Booking.findByIdAndUpdate(cancellation.bookingId._id, { status: "cancelled" });
    }
    
    res.json(cancellation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;