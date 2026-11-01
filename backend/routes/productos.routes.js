const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
let productos = require("../data/productos");

const DATA_PATH = path.join(__dirname, "../data/productos.js");

// Función auxiliar para persistir cambios en backend/data/productos.js
function guardarProductosEnDisco() {
  try {
    const contenido = `const productos = ${JSON.stringify(productos, null, 2)};\n\nmodule.exports = productos;\n`;
    fs.writeFileSync(DATA_PATH, contenido, "utf8");
  } catch (err) {
    console.error("Error al persistir productos en archivo:", err);
  }
}

// GET /api/productos - Obtener todos los productos
router.get("/", (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id - Obtener un producto por ID
router.get("/:id", (req, res) => {
  const paramId = req.params.id;
  const numericId = parseInt(paramId, 10);

  const producto = productos.find(
    (p) => p.id === numericId || String(p.id) === paramId || p._id === paramId
  );

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

// POST /api/productos - Crear un nuevo producto
router.post("/", (req, res) => {
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
    material,
    measurements,
    medidas,
    stock,
  } = req.body;

  const finalName = (name || nombre || "").trim();
  const rawPrice = price !== undefined ? price : precio;
  const finalPrice = Number(rawPrice);

  if (!finalName) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio." });
  }

  if (isNaN(finalPrice) || finalPrice <= 0) {
    return res
      .status(400)
      .json({ error: "El precio debe ser un número válido mayor a 0." });
  }

  const finalDesc = (description || descripcion || "").trim();
  const finalCat = (category || categoria || "Living").trim();
  const finalImage = (image || imageUrl || "/images/products/sillon-copacabana.png").trim();

  // Generar ID numérico único
  const nextId =
    productos.length > 0
      ? Math.max(...productos.map((p) => Number(p.id) || 0)) + 1
      : 1;

  const nuevoProducto = {
    id: nextId,
    _id: String(nextId),
    name: finalName,
    nombre: finalName,
    category: finalCat,
    categoria: finalCat,
    material: (material || "").trim(),
    price: finalPrice,
    precio: finalPrice,
    measurements: (measurements || medidas || "").trim(),
    medidas: (measurements || medidas || "").trim(),
    image: finalImage,
    imageUrl: finalImage,
    description: finalDesc,
    descripcion: finalDesc,
    stock: stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : 1,
  };

  productos.push(nuevoProducto);
  guardarProductosEnDisco();

  return res.status(201).json(nuevoProducto);
});

// PUT /api/productos/:id - Editar un producto existente
router.put("/:id", (req, res) => {
  const paramId = req.params.id;
  const numericId = parseInt(paramId, 10);

  const index = productos.findIndex(
    (p) => p.id === numericId || String(p.id) === paramId || p._id === paramId
  );

  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado para editar." });
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
    material,
    measurements,
    medidas,
    stock,
  } = req.body;

  const current = productos[index];

  const finalName = name !== undefined || nombre !== undefined
    ? ((name || nombre || "").trim())
    : (current.name || current.nombre);

  if (!finalName) {
    return res.status(400).json({ error: "El nombre no puede quedar vacío." });
  }

  let finalPrice = current.price || current.precio;
  if (price !== undefined || precio !== undefined) {
    const rawPrice = price !== undefined ? price : precio;
    finalPrice = Number(rawPrice);
    if (isNaN(finalPrice) || finalPrice <= 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número válido mayor a 0." });
    }
  }

  const finalCat = category !== undefined || categoria !== undefined
    ? ((category || categoria || "").trim())
    : (current.category || current.categoria);

  const finalDesc = description !== undefined || descripcion !== undefined
    ? ((description || descripcion || "").trim())
    : (current.description || current.descripcion);

  const finalImage = image !== undefined || imageUrl !== undefined
    ? ((image || imageUrl || "").trim())
    : (current.image || current.imageUrl);

  const finalMaterial = material !== undefined ? material.trim() : current.material;
  const finalMeasurements = measurements !== undefined || medidas !== undefined
    ? (measurements || medidas || "").trim()
    : (current.measurements || current.medidas);

  const finalStock = stock !== undefined && !isNaN(Number(stock))
    ? Number(stock)
    : current.stock;

  const productoActualizado = {
    ...current,
    name: finalName,
    nombre: finalName,
    price: finalPrice,
    precio: finalPrice,
    category: finalCat,
    categoria: finalCat,
    description: finalDesc,
    descripcion: finalDesc,
    image: finalImage,
    imageUrl: finalImage,
    material: finalMaterial,
    measurements: finalMeasurements,
    medidas: finalMeasurements,
    stock: finalStock,
  };

  productos[index] = productoActualizado;
  guardarProductosEnDisco();

  return res.json(productoActualizado);
});

// DELETE /api/productos/:id - Eliminar un producto por ID
router.delete("/:id", (req, res) => {
  const paramId = req.params.id;
  const numericId = parseInt(paramId, 10);

  const index = productos.findIndex(
    (p) => p.id === numericId || String(p.id) === paramId || p._id === paramId
  );

  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado para eliminar." });
  }

  const eliminado = productos.splice(index, 1)[0];
  guardarProductosEnDisco();

  return res.json({
    message: "Producto eliminado correctamente",
    producto: eliminado,
  });
});

module.exports = router;
