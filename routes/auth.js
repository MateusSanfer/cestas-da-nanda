const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { authenticate } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/me", authenticate, authController.updateProfile);

module.exports = router;
