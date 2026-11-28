const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

// Todas las rutas de pedidos están protegidas mediante JWT
router.use(authMiddleware);

// POST /api/orders - Crear un nuevo pedido
router.post("/", createOrder);

// GET /api/orders/my-orders - Consultar historial de pedidos del usuario autenticado
router.get("/my-orders", getMyOrders);

// GET /api/orders/:id - Consultar detalle de un pedido específico
router.get("/:id", getOrderById);

module.exports = router;
