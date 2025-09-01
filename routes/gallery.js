



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