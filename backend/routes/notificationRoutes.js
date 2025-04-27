const express = require('express');
const router = express.Router();
const NotificationSettings = require('../models/NotificationSettings');
const User = require('../models/User');

// Middleware to check if the user exists (by ID)
const userExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Route: Get notification settings for a user
router.get('/:userId', userExists, async (req, res) => {
  try {
    const notificationSettings = await NotificationSettings.findOne({ userId: req.params.userId });
    
    if (!notificationSettings) {
      return res.status(404).json({ message: 'Notification settings not found' });
    }
    
    res.json(notificationSettings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: Update notification settings for a user
router.put('/:userId', userExists, async (req, res) => {
  const { emailEnabled, smsEnabled, inAppEnabled, emergencyEnabled } = req.body;

  // Check if all fields are provided
  if (emailEnabled === undefined || smsEnabled === undefined || inAppEnabled === undefined || emergencyEnabled === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if notification settings exist for the user
    let notificationSettings = await NotificationSettings.findOne({ userId: req.params.userId });

    // If not, create new notification settings
    if (!notificationSettings) {
      notificationSettings = new NotificationSettings({
        userId: req.params.userId,
        emailEnabled,
        smsEnabled,
        inAppEnabled,
        emergencyEnabled
      });
    } else {
      // Update existing notification settings
      notificationSettings.emailEnabled = emailEnabled;
      notificationSettings.smsEnabled = smsEnabled;
      notificationSettings.inAppEnabled = inAppEnabled;
      notificationSettings.emergencyEnabled = emergencyEnabled;
    }

    // Save updated settings
    await notificationSettings.save();
    res.json(notificationSettings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
