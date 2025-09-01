



const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')

// GET - get all users ---------------------------------------
router.get('/', Utils.authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Couldn't get users", error: err.message })
  }
})

// GET - get single user -------------------------------------------------------
router.get('/:id', Utils.authenticateToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      return res.status(401).json({ message: "Not authorised" })
    }

    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Couldn't get user", error: err.message })
  }
})

// ... rest of your PUT and POST routes ...

module.exports = router