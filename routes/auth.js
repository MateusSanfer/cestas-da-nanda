const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { authenticate } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/me", authenticate, authController.updateProfile);

// Rotas de Admin
const { requireAdmin } = require("../middlewares/authMiddleware");
router.get("/users", authenticate, requireAdmin, authController.getAllUsers);
router.put(
  "/users/:id/role",
  authenticate,
  requireAdmin,
  authController.updateUserRole
);

module.exports = router;
