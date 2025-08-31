


const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  alt: {
    type: String,
    default: "",
    trim: true,
  },
  src: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema, 'galleryImages');