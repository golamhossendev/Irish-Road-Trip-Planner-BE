const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  distance: String,
  duration: String,
  temperature: Number,
  condition: String,
  fuel: String,
  essentials: [String],
  dateSaved: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);