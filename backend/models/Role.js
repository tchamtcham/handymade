const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  permissions: String,
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
