const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber'); // Assuming a Mongoose model

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Could not subscribe.' });
  }
});

module.exports = router;
