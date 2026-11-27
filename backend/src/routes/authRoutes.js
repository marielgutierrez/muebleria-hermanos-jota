const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas públicas de autenticación
router.post("/register", register);
router.post("/login", login);

// Ruta protegida de perfil
router.get("/me", authMiddleware, getMe);
router.get("/profile", authMiddleware, getMe);

module.exports = router;
