const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema({
  name: String,
  contactEmail: String,
  contactPhone: String,
  logo: String,
  favicon: String,
  primaryColor: String,
  secondaryColor: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Platform', platformSchema);
