// const express = require('express')
// const router = express.Router()
// const Utils = require('./../utils')
// const User = require('./../models/User')
// const path = require('path')

// // GET - get single user -------------------------------------------------------
// router.get('/:id', Utils.authenticateToken, (req, res) => {
//   if(req.user._id != req.params.id){
//     return res.status(401).json({
//       message: "Not authorised"
//     })
//   }

//   User.findById(req.params.id)
//     .then(user => {
//       res.json(user)
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({
//         message: "Couldn't get user",
//         error: err
//       })
//     })
// })


// // PUT - update user ---------------------------------------------
// router.put('/:id', Utils.authenticateToken, (req, res) => {
//   // validate request
//   if(!req.body) return res.status(400).send("Task content can't be empty")
  
//   let avatarFilename = null

//   // if avatar image exists, upload!
//   if(req.files && req.files.avatar){
//     // upload avater image then update user
//     let uploadPath = path.join(__dirname, '..', 'public', 'images')
//     Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
//       avatarFilename = uniqueFilename
//       // update user with all fields including avatar
//       updateUser({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         avatar: avatarFilename        
//       })
//     })
//   }else{
//     // update user without avatar
//     updateUser({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email      
//     })
//   }
  
//   // update User
//   function updateUser(update){    
//     User.findByIdAndUpdate(req.params.id, update, {new: true})
//     .then(user => res.json(user))
//     .catch(err => {
//       res.status(500).json({
//         message: 'Problem updating user',
//         error: err
//       })
//     }) 
//   }
// })

// // POST - create new user --------------------------------------
// router.post('/', (req, res) => {
//   // validate request
//   if(Object.keys(req.body).length === 0){   
//     return res.status(400).send({message: "User content can not be empty"})
//   }

//   // check account with email doen't already exist
//   User.findOne({email: req.body.email})
//   .then(user => {
//     if( user != null ){
//       return res.status(400).json({
//         message: "email already in use, use different email address"
//       })
//     }
//   // create new user       
//   let newUser = new User(req.body)
//   newUser.save()
//     .then(user => {        
//       // success!  
//       // return 201 status with user object
//       return res.status(201).json(user)
//     })
//     .catch(err => {
//       console.log(err)
//       return res.status(500).send({
//         message: "Problem creating account",
//         error: err
//       })
//     })
//   })
// })

// module.exports = router


// const express = require('express')
// const router = express.Router()
// const Utils = require('./../utils')
// const User = require('./../models/User')
// const path = require('path')

// // GET - get single user -------------------------------------------------------
// router.get('/:id', Utils.authenticateToken, async (req, res) => {
//   try {
//     if (req.user._id !== req.params.id) {
//       return res.status(401).json({ message: "Not authorised" })
//     }

//     const user = await User.findById(req.params.id).select('-password')
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     res.json(user)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: "Couldn't get user", error: err.message })
//   }
// })

// // PUT - update user ---------------------------------------------
// router.put('/:id', Utils.authenticateToken, async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "User data can't be empty" })
//     }

//     if (req.user._id !== req.params.id) {
//       return res.status(401).json({ message: "Not authorised" })
//     }

//     let updateData = {
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//     }

//     if (req.files && req.files.avatar) {
//       const uploadPath = path.join(__dirname, '..', 'public', 'images')

//       updateData.avatar = await new Promise((resolve, reject) => {
//         Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
//           if (!uniqueFilename) reject(new Error('Avatar upload failed'))
//           else resolve(uniqueFilename)
//         })
//       })
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password')

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     res.json(updatedUser)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: 'Problem updating user', error: err.message })
//   }
// })

// // POST - create new user --------------------------------------
// router.post('/', async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "User content cannot be empty" })
//     }

//     const existingUser = await User.findOne({ email: req.body.email })
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use, use different email address" })
//     }

//     const newUser = new User(req.body)
//     const savedUser = await newUser.save()

//     const userResponse = savedUser.toObject()
//     delete userResponse.password // Remove password from response

//     res.status(201).json(userResponse)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: "Problem creating account", error: err.message })
//   }
// })

// module.exports = router



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