// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all customers (clients)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      role: 'client',
      ...(search && {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      }),
      ...(status && { status })
    };

    const customers = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    const customersWithStats = await Promise.all(customers.map(async customer => {
      const bookingsCount = await Booking.countDocuments({ customerId: customer._id });
      const complaintsCount = await Review.countDocuments({
        customerId: customer._id,
        rating: { $lte: 2 }
      });

      return {
        ...customer.toObject(),
        bookingsCount,
        complaintsCount
      };
    }));

    res.json({
      customers: customersWithStats,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'client') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const bookings = await Booking.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('serviceId', 'title price');

    const complaints = await Review.find({
      customerId: customer._id,
      rating: { $lte: 2 }
    }).sort({ createdAt: -1 });

    res.json({
      customer,
      bookings,
      complaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new customer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fullName, email, phoneNumber, status = 'active' } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newCustomer = new User({
      fullName,
      email,
      phoneNumber,
      role: 'client',
      status
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete single customer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await User.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Booking.deleteMany({ customerId: customer._id });
    await Review.deleteMany({ customerId: customer._id });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete multiple customers
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No customer IDs provided' });
    }

    await Promise.all(ids.map(async id => {
      await User.findByIdAndDelete(id);
      await Booking.deleteMany({ customerId: id });
      await Review.deleteMany({ customerId: id });
    }));

    res.json({ message: 'Customers deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
