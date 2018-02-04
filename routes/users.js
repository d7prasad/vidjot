const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')



// User Login route
router.get('/login',(req, res) =>{
  res.send('login')
})

// User Registeration route
router.get('/register', (req, res) => {
  res.send('register')
})

module.exports = router

