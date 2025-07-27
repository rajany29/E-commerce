const express = require('express');
const router = express.Router();
const {Register,Login , updateProfile} = require('../controller/user_controller')
const {auth} = require('../config/utils')

router.post('/register' , Register)
router.post('/login' , Login)
router.put('/profile', auth, updateProfile)


module.exports = router
