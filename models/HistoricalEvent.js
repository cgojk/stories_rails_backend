const mongoose = require('mongoose');

const historicalEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  description: { type: String },
  image: { type: String },
  order: { type: Number },
}, {
  collection: 'historical' // explicit collection name
});

const HistoricalEvent = mongoose.model('HistoricalEvent', historicalEventSchema);

module.exports = HistoricalEvent;