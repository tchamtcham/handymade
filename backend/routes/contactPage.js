// routes/contactPage.js
const express = require('express');
const router = express.Router();
const ContactPage = require('../models/contactPage'); // Correct import

// POST /api/contactPage
router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Use the correct model (ContactPage)
    const newContact = new ContactPage({
      fullName,  // Correct field names from the schema
      email,
      message
    });

    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
