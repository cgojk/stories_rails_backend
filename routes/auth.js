require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const Utils = require('./../utils');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for protected routes
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// POST /signup - create new user
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    const payload = { _id: newUser._id };
    const accessToken = Utils.generateAccessToken(payload);

    newUser.password = undefined;

    res.status(201).json({ accessToken, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /signin - user login
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found' });
    }

    const isPasswordValid = Utils.verifyHash(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }

    const payload = { _id: user._id };
    const accessToken = Utils.generateAccessToken(payload);

    user.password = undefined;

    return res.json({ accessToken, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /validate - validate JWT token and return user data
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = undefined;
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Problem validating token', error: err.message });
  }
});

module.exports = router;