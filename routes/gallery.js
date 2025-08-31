// const express = require('express');
// const router = express.Router();
// const cloudinary = require('../config/cloudinary');
// const GalleryImage = require('../models/GalleryImage');
// const fileUpload = require('express-fileupload');

// // Middleware for file upload is already used in your server.js

// router.post('/upload', async (req, res) => {
//   try {
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ message: 'No image file uploaded' });
//     }

//     const file = req.files.image;

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: 'gallery_images', // optional: organize images in a folder
//     });

//     // Save URL and alt text in MongoDB
//     const newImage = new GalleryImage({
//       url: result.secure_url,
//       alt: req.body.alt || 'Gallery image',
//     });

//     await newImage.save();

//     res.status(201).json({ message: 'Image uploaded!', url: newImage.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Upload failed' });
//   }
// });

// // Get all gallery images
// router.get('/', async (req, res) => {
//   try {
//     const images = await GalleryImage.find().sort({ uploadedAt: -1 });
//     res.json(images);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch images' });
//   }
// });

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const cloudinary = require('../config/cloudinary');
// const GalleryImage = require('../models/GalleryImage');

// // POST /api/gallery/upload
// router.post('/upload', async (req, res) => {
//   try {
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ message: 'No image file uploaded' });
//     }

//     const file = req.files.image;

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: 'gallery_images',
//     });

//     // Save image metadata in MongoDB
//     const newImage = new GalleryImage({
//       imageUrl: result.secure_url,
//       title: req.body.title || '',
//       description: req.body.description || '',
//       order: req.body.order || 0,
//     });

//     await newImage.save();

//     res.status(201).json({ message: 'Image uploaded!', image: newImage });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ message: 'Upload failed' });
//   }
// });

// // GET /api/gallery
// router.get('/', async (req, res) => {
//   try {
//     const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
//     res.json(images);
//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).json({ message: 'Failed to fetch images' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');

router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    console.log('Fetched images:', images); // for debugging
    res.json(images);
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    res.status(500).json({ message: 'Failed to fetch gallery images' });
  }
});

module.exports = router;
















// // routes/gallery.js
// import express from "express";
// import GalleryImage from "../models/GalleryImage.js";

// const router = express.Router();

// // GET all gallery images (sorted by order)
// router.get("/", async (req, res) => {
//   try {
//     const images = await GalleryImage.find().sort({ order: 1 });
//     res.json(images);
//   } catch (err) {
//     console.error("Error fetching gallery images:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Optional: POST new image (for admin use)
// router.post("/", async (req, res) => {
//   try {
//     const newImage = new GalleryImage(req.body);
//     await newImage.save();
//     res.status(201).json(newImage);
//   } catch (err) {
//     console.error("Error saving image:", err);
//     res.status(400).json({ message: "Invalid data" });
//   }
// });

// export default router;