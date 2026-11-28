const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Función auxiliar para buscar producto por ObjectId o por id numérico
const findProduct = async (identifier) => {
  if (!identifier) return null;

  if (mongoose.isValidObjectId(identifier)) {
    const product = await Product.findById(identifier);
    if (product) return product;
  }

  const numericId = Number(identifier);
  if (!isNaN(numericId)) {
    const product = await Product.findOne({ id: numericId });
    if (product) return product;
  }

  return await Product.findOne({ _id: identifier }).catch(() => null);
};

/**
 * POST /api/orders
 * Crear un nuevo pedido a partir de los productos enviados en el carrito
 * Endpoint protegido con JWT
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, productos } = req.body;
    const rawItems = items || productos;

    // 1. Validar que exista la lista de items y no esté vacía
    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({
        message: "El pedido debe contener al menos un producto (items no puede estar vacío)",
        error: "Items vacíos",
      });
    }

    const processedItems = [];
    let calculatedTotal = 0;
    const productsToUpdateStock = [];

    // 2. Procesar y validar cada producto contra la base de datos
    for (const item of rawItems) {
      const productId = item.product || item.productId || item._id || item.id;
      const rawQuantity = item.quantity !== undefined ? item.quantity : item.cantidad;

      if (!productId) {
        return res.status(400).json({
          message: "Cada item debe especificar un identificador de producto válido",
          error: "Producto no especificado en el item",
        });
      }

      const quantity = parseInt(rawQuantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: "La cantidad solicitada debe ser un número entero mayor a 0",
          error: "Cantidad inválida",
        });
      }

      // Buscar el producto real en MongoDB
      const dbProduct = await findProduct(productId);
      if (!dbProduct) {
        return res.status(404).json({
          message: `Producto no encontrado en el catálogo (ID: ${productId})`,
          error: "Producto no encontrado",
        });
      }

      // Validar disponibilidad de stock
      if (typeof dbProduct.stock === "number") {
        if (dbProduct.stock < quantity) {
          return res.status(400).json({
            message: `Stock insuficiente para "${dbProduct.name}". Disponible: ${dbProduct.stock}, solicitado: ${quantity}`,
            error: "Stock insuficiente",
          });
        }
      }

      const unitPrice = Number(dbProduct.price);
      const subtotal = unitPrice * quantity;
      calculatedTotal += subtotal;

      processedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: unitPrice,
        quantity,
        imageUrl: dbProduct.imageUrl || "/images/products/sillon-copacabana.png",
      });

      productsToUpdateStock.push({
        doc: dbProduct,
        quantity,
      });
    }

    // 3. Descontar el stock de los productos comprados
    for (const item of productsToUpdateStock) {
      if (typeof item.doc.stock === "number") {
        item.doc.stock = Math.max(0, item.doc.stock - item.quantity);
        await item.doc.save();
      }
    }

    // 4. Crear el pedido asociado al usuario autenticado (extraído del token JWT)
    const newOrder = await Order.create({
      user: req.user._id,
      items: processedItems,
      total: calculatedTotal,
      status: "confirmado",
    });

    return res.status(201).json({
      message: "Pedido creado exitosamente",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error en createOrder:", error);
    return next(error);
  }
};

/**
 * GET /api/orders/my-orders
 * Consultar los pedidos del usuario autenticado
 * Endpoint protegido con JWT
 */
const getMyOrders = async (req, res, next) => {
  try {
    // Filtrar estrictamente por el usuario autenticado (impide acceso a pedidos ajenos)
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price imageUrl category");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error en getMyOrders:", error);
    return next(error);
  }
};

/**
 * GET /api/orders/:id
 * Consultar el detalle de un pedido por ID
 * Impide acceso si el pedido pertenece a otro usuario
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identificador de pedido inválido",
        error: "ID inválido",
      });
    }

    const order = await Order.findById(id).populate(
      "items.product",
      "name price imageUrl category"
    );

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado",
        error: "Pedido no encontrado",
      });
    }

    // Verificar que el pedido pertenezca al usuario autenticado
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Acceso denegado: no tenés autorización para ver un pedido de otro usuario",
        error: "Pedido ajeno",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error en getOrderById:", error);
    return next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
