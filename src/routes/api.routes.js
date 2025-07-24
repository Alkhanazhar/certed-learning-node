const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const courseRoutes = require("./course.routes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/course", courseRoutes);

module.exports = router;


