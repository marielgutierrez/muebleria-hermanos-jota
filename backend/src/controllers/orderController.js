const Order = require("../models/Order");

/**
 * Crear un nuevo pedido
 * POST /api/pedidos o POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        mensaje: "El pedido debe incluir una lista de items no vacía.",
        message: "Order items cannot be empty",
      });
    }

    const calculatedTotal =
      typeof total === "number" && total >= 0
        ? total
        : items.reduce((acc, item) => acc + (Number(item.precio || item.price || 0) * Number(item.cantidad || 1)), 0);

    const newOrder = new Order({
      user: req.user ? req.user._id : null,
      items: items.map((it) => ({
        productoId: String(it.productoId || it.id || it._id || "prod"),
        nombre: it.nombre || it.name || "Producto",
        precio: Number(it.precio || it.price || 0),
        cantidad: Math.max(1, Number(it.cantidad || it.quantity || 1)),
      })),
      total: calculatedTotal,
      estado: "confirmado",
      shippingAddress: shippingAddress || {},
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return res.status(500).json({
      mensaje: "Error interno al procesar el pedido.",
      error: error.message,
    });
  }
};

/**
 * Obtener pedidos
 * GET /api/pedidos o GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const filter = req.user ? { user: req.user._id } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({
      mensaje: "Error interno al obtener los pedidos.",
      error: error.message,
    });
  }
};

/**
 * Obtener un pedido por ID
 * GET /api/pedidos/:id o GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado.",
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error al obtener pedido por ID:", error);
    return res.status(500).json({
      mensaje: "Error interno al obtener el pedido.",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
