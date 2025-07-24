const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, verifyAdmin }=require("../middlewares/auth.middlewares")

router.put('/update/:id', verifyToken, userController.updateProfile);
router.patch('/change-password', verifyToken, userController.changePassword);
router.get('/:id', verifyToken, userController.getUserById); 
router.post('/contact', userController.contactForm); 

// admin access
router.get('/', verifyAdmin, userController.getAllUsers)

module.exports = router;
