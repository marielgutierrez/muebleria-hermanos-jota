const mongoose = require("mongoose");
const Product = require("../models/Product");

// Buscar producto por MongoDB ObjectId o por ID numérico/custom
const findProductByIdOrCustom = async (id) => {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const product = await Product.findById(id);
    if (product) return product;
  }

  const numericId = Number(id);
  if (!isNaN(numericId)) {
    const product = await Product.findOne({ id: numericId });
    if (product) return product;
  }

  return await Product.findOne({ _id: id }).catch(() => null);
};

// GET /api/products o /api/productos
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// GET /api/products/:id o /api/productos/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findProductByIdOrCustom(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: "Producto no encontrado.",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

// POST /api/products o /api/productos
const createProduct = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body cannot be empty",
        error: "El cuerpo de la petición no puede estar vacío.",
      });
    }

    const {
      name,
      nombre,
      price,
      precio,
      category,
      categoria,
      description,
      descripcion,
      image,
      imageUrl,
      imagenUrl,
      material,
      measurements,
      medidas,
      stock,
    } = req.body;

    const finalName = (name || nombre || "").toString().trim();
    if (!finalName) {
      return res.status(400).json({
        message: "Product name is required",
        error: "El nombre del producto es obligatorio.",
      });
    }

    const rawPrice = price !== undefined ? price : precio;
    if (rawPrice === undefined || rawPrice === null || rawPrice === "") {
      return res.status(400).json({
        message: "Product price is required",
        error: "El precio del producto es obligatorio.",
      });
    }

    const numericPrice = Number(rawPrice);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid non-negative number",
        error: "El precio debe ser un número válido mayor o igual a 0.",
      });
    }

    let numericStock = 0;
    if (stock !== undefined && stock !== null && stock !== "") {
      const parsedStock = Number(stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          message: "Stock must be a valid non-negative number",
          error: "El stock debe ser un número válido mayor o igual a 0.",
        });
      }
      numericStock = parsedStock;
    }

    // Calcular próximo ID numérico para compatibilidad
    const lastProductWithId = await Product.findOne({ id: { $exists: true } }).sort({ id: -1 });
    const nextId = lastProductWithId && typeof lastProductWithId.id === "number" ? lastProductWithId.id + 1 : undefined;

    const payload = {
      name: finalName,
      category: (category || categoria || "Living").toString().trim(),
      material: (material || "").toString().trim(),
      price: numericPrice,
      measurements: (measurements || medidas || "").toString().trim(),
      imageUrl: (imageUrl || image || imagenUrl || "/images/products/sillon-copacabana.png").toString().trim(),
      description: (description || descripcion || "").toString().trim(),
      stock: numericStock,
    };

    if (nextId !== undefined) {
      payload.id = nextId;
    }

    const newProduct = await Product.create(payload);
    return res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, error: error.message });
    }
    return next(error);
  }
};

// PUT /api/products/:id o /api/productos/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body cannot be empty",
        error: "El cuerpo de la petición no puede estar vacío.",
      });
    }

    const product = await findProductByIdOrCustom(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: "Producto no encontrado para editar.",
      });
    }

    const {
      name,
      nombre,
      price,
      precio,
      category,
      categoria,
      description,
      descripcion,
      image,
      imageUrl,
      imagenUrl,
      material,
      measurements,
      medidas,
      stock,
    } = req.body;

    const finalName = name !== undefined || nombre !== undefined ? (name || nombre || "").toString().trim() : undefined;
    if (finalName !== undefined) {
      if (!finalName) {
        return res.status(400).json({
          message: "Product name cannot be empty",
          error: "El nombre no puede quedar vacío.",
        });
      }
      product.name = finalName;
    }

    const rawPrice = price !== undefined ? price : precio;
    if (rawPrice !== undefined) {
      const numericPrice = Number(rawPrice);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          message: "Price must be a valid non-negative number",
          error: "El precio debe ser un número válido mayor o igual a 0.",
        });
      }
      product.price = numericPrice;
    }

    if (category !== undefined || categoria !== undefined) {
      product.category = (category || categoria || "Living").toString().trim();
    }

    if (material !== undefined) {
      product.material = material.toString().trim();
    }

    if (measurements !== undefined || medidas !== undefined) {
      product.measurements = (measurements || medidas || "").toString().trim();
    }

    if (imageUrl !== undefined || image !== undefined || imagenUrl !== undefined) {
      product.imageUrl = (imageUrl || image || imagenUrl || "").toString().trim();
    }

    if (description !== undefined || descripcion !== undefined) {
      product.description = (description || descripcion || "").toString().trim();
    }

    if (stock !== undefined && stock !== null && stock !== "") {
      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0) {
        return res.status(400).json({
          message: "Stock must be a valid non-negative number",
          error: "El stock debe ser un número válido mayor o igual a 0.",
        });
      }
      product.stock = numericStock;
    }

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, error: error.message });
    }
    return next(error);
  }
};

// DELETE /api/products/:id o /api/productos/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findProductByIdOrCustom(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: "Producto no encontrado para eliminar.",
      });
    }

    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({
      message: "Product deleted",
      producto: product,
      product: product,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
