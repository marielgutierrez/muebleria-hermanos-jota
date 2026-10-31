const mongoose = require("mongoose");
const Product = require("../models/Product");

const ALLOWED_FIELDS = ["name", "description", "price", "stock", "imageUrl"];

const filterAllowedFields = (body) => {
  const filtered = {};
  if (!body || typeof body !== "object") return filtered;

  ALLOWED_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      filtered[field] = body[field];
    }
  });

  return filtered;
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar formato del ObjectId de MongoDB
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const payload = filterAllowedFields(req.body);

    if (!payload.name || typeof payload.name !== "string" || payload.name.trim() === "") {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (payload.price === undefined || payload.price === null || payload.price === "") {
      return res.status(400).json({ message: "Product price is required" });
    }

    const numericPrice = Number(payload.price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Price must be a valid non-negative number" });
    }
    payload.price = numericPrice;

    if (payload.stock !== undefined && payload.stock !== null && payload.stock !== "") {
      const numericStock = Number(payload.stock);
      if (isNaN(numericStock) || numericStock < 0) {
        return res.status(400).json({ message: "Stock must be a valid non-negative number" });
      }
      payload.stock = numericStock;
    }

    const newProduct = await Product.create(payload);
    return res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const payload = filterAllowedFields(req.body);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Request body does not contain valid product fields" });
    }

    if (payload.name !== undefined) {
      if (typeof payload.name !== "string" || payload.name.trim() === "") {
        return res.status(400).json({ message: "Product name cannot be empty" });
      }
    }

    if (payload.price !== undefined) {
      const numericPrice = Number(payload.price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: "Price must be a valid non-negative number" });
      }
      payload.price = numericPrice;
    }

    if (payload.stock !== undefined) {
      const numericStock = Number(payload.stock);
      if (isNaN(numericStock) || numericStock < 0) {
        return res.status(400).json({ message: "Stock must be a valid non-negative number" });
      }
      payload.stock = numericStock;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted",
      product: deletedProduct,
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
