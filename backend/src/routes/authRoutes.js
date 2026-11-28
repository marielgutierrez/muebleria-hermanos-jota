const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas públicas de autenticación (Sprint 7 y 8 — Integrante 1)
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas de usuario (Sprint 7 y 8 — Integrante 2 y 3)
router.get("/me", authMiddleware, getMe);
router.get("/profile", authMiddleware, getMe);

module.exports = router;
