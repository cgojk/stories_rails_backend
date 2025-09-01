require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')  // Added for static files

const port = process.env.PORT || 3000

const app = express()

app.use(express.static('public'))

// Serve uploads folder
app.use('/uploads', express.static('uploads'))

// Serve static images folder (including /images/historical)
app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}))

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database connected!"))
.catch(err => console.error(" Database connection failed:", err))

// ROUTES
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const userRouter = require('./routes/user')
app.use('/user', userRouter)

// IMPORTANT: Mount podcasts router under /api/podcasts
const podcastRouter = require('./routes/podcast')
app.use('/api/podcasts', podcastRouter)

const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);

const galleryRouter = require('./routes/gallery');
app.use('/api/gallery', galleryRouter);

// NEW: Historical Events router
const historicalEventsRouter = require('./routes/historicalEvents')
app.use('/api/historical-events', historicalEventsRouter)

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`)
})