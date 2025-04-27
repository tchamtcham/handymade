const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: String,
  serviceAreas: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
