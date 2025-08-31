// routes/historicalEvents.js
const express = require('express')
const router = express.Router()
const HistoricalEvent = require('../models/HistoricalEvent') // Adjust path if needed

// GET all historical events
router.get('/', async (req, res) => {
  try {
    const events = await HistoricalEvent.find().sort({ order: 1 }) // sorting by order
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET one event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create new event
router.post('/', async (req, res) => {
  const event = new HistoricalEvent({
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    image: req.body.image,
    order: req.body.order
  })

  try {
    const newEvent = await event.save()
    res.status(201).json(newEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update event by ID
router.put('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    event.title = req.body.title ?? event.title
    event.date = req.body.date ?? event.date
    event.description = req.body.description ?? event.description
    event.image = req.body.image ?? event.image
    event.order = req.body.order ?? event.order

    const updatedEvent = await event.save()
    res.json(updatedEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE event by ID
router.delete('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    await event.remove()
    res.json({ message: 'Deleted Event' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router