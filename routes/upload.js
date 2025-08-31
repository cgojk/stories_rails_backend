const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const fileUpload = require('express-fileupload');

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'your-folder-name',  // optional: organize uploads in Cloudinary
    });

    // Return the URL of the uploaded image
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;