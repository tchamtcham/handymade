const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issue: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved", "rejected"], default: "pending" },
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dispute", DisputeSchema);