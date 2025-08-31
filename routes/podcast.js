



const express = require("express");
const router = express.Router();
const Podcast = require("../models/Podcast");
const path = require("path");
const fs = require("fs");

// GET /podcasts - fetch all podcasts
router.get("/", async (req, res) => {
  try {
    const podcasts = await Podcast.find();
    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch podcasts." });
  }
});

// GET /podcasts/:id - fetch a single podcast by ID
router.get("/:id", async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ error: "Podcast not found" });
    }
    res.json(podcast);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch podcast." });
  }
});

// GET /podcasts/category/:category - fetch podcasts by category (case-insensitive)
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const podcasts = await Podcast.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') } // case-insensitive exact match
    });
    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch podcasts by category." });
  }
});

// POST /podcasts - create new podcast with optional image and required audio
router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: "Audio file is required." });
    }

    const audioFile = req.files.audio;

    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean audio filename
    const safeAudioFilename = Date.now() + "-" + audioFile.name
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");

    await audioFile.mv(path.join(uploadDir, safeAudioFilename));

    let imagePath = "";
    if (req.files.image) {
      const imageFile = req.files.image;
      // Clean image filename
      const safeImageFilename = Date.now() + "-" + imageFile.name
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");

      await imageFile.mv(path.join(uploadDir, safeImageFilename));
      imagePath = `/uploads/${safeImageFilename}`;
    }

    const newPodcast = new Podcast({
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration || "",
      category: req.body.category || "",
      image: imagePath,
      audioUrl: `/uploads/${safeAudioFilename}`,
    });

    const savedPodcast = await newPodcast.save();
    res.status(201).json(savedPodcast);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while uploading podcast." });
  }
});

module.exports = router;