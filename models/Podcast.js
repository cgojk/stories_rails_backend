const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  name: String,
  audioUrl: String,
  duration: String,
  description: String,
  image: String,
  category: String
});

module.exports = mongoose.model('Podcast', podcastSchema);