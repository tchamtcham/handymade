const mongoose = require('mongoose');

// Notification settings schema
const notificationSettingsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  emailEnabled: { 
    type: Boolean, 
    default: true 
  },
  smsEnabled: { 
    type: Boolean, 
    default: false 
  },
  inAppEnabled: { 
    type: Boolean, 
    default: true 
  },
  emergencyEnabled: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Create the NotificationSettings model
const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
