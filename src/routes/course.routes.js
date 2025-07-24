const express = require('express');
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { verifyToken } = require("../middlewares/auth.middlewares")

router.get('/', courseController.getAllCourses); 
router.post('/create-order',verifyToken, courseController.purchaseCourse);
router.post('/verify-payment', verifyToken, courseController.verifyPayment);
// router.get('/user/:user_id', courseController.getUserCoursePurchases);

module.exports = router;
