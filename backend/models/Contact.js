// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
