const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");

// Forzar base de datos de test
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/hermanos-jota-test";
process.env.CLIENT_URL = "https://hermanos-jota-store.netlify.app";

const app = require("../src/app");
const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");

let server;
let baseUrl;

describe("Pruebas de Integración CRUD - API Hermanos Jota", () => {
  before(async () => {
    await connectDB();
    // Limpiar colección de pruebas
    await Product.deleteMany({});

    // Iniciar servidor HTTP en un puerto aleatorio disponible
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`Servidor de prueba ejecutándose en ${baseUrl}`);
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    // Limpieza posterior
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  // 1. Health check
  test("GET /api/health debe responder 200 con status ok", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
  });

  // 2. CORS preflight / origin
  test("CORS debe permitir peticiones desde https://hermanos-jota-store.netlify.app", async () => {
    const res = await fetch(`${baseUrl}/api/productos`, {
      headers: {
        Origin: "https://hermanos-jota-store.netlify.app",
      },
    });
    assert.equal(res.status, 200);
    assert.equal(
      res.headers.get("access-control-allow-origin"),
      "https://hermanos-jota-store.netlify.app"
    );
  });

  // 3. GET colección vacía o inicial
  test("GET /api/productos debe responder 200 y devolver un array", async () => {
    const res = await fetch(`${baseUrl}/api/productos`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  // 4. POST - Crear producto (CREATE)
  let createdProduct = null;
  test("POST /api/productos debe crear un nuevo producto con código 201", async () => {
    const payload = {
      name: "Mesa Centro Palermo",
      category: "Living",
      material: "Petiribí macizo y vidrio templado",
      price: 145000,
      measurements: "120 × 60 × 45 cm",
      imageUrl: "/images/products/mesa-palermo.png",
      description: "Mesa de centro con estructura orgánica de madera petiribí.",
      stock: 5,
    };

    const res = await fetch(`${baseUrl}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    assert.equal(res.status, 201);
    createdProduct = await res.json();

    assert.ok(createdProduct._id, "Debe tener un _id asignado por MongoDB");
    assert.equal(createdProduct.name, payload.name);
    assert.equal(createdProduct.price, payload.price);
    assert.equal(createdProduct.stock, payload.stock);
    assert.equal(createdProduct.nombre, payload.name); // Alias toJSON
  });

  // 5. Validaciones al crear
  test("POST /api/productos sin nombre debe responder 400", async () => {
    const res = await fetch(`${baseUrl}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 5000 }),
    });

    assert.equal(res.status, 400);
    const err = await res.json();
    assert.ok(err.error || err.message);
  });

  test("POST /api/productos con precio negativo debe responder 400", async () => {
    const res = await fetch(`${baseUrl}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Silla Inválida", price: -10 }),
    });

    assert.equal(res.status, 400);
  });

  // 6. GET por ID (READ)
  test("GET /api/productos/:id debe devolver el producto creado", async () => {
    assert.ok(createdProduct, "Se requiere el producto creado previamente");
    const res = await fetch(`${baseUrl}/api/productos/${createdProduct._id}`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data._id, createdProduct._id);
    assert.equal(data.name, createdProduct.name);
  });

  // 7. GET por ruta alias /api/products/:id
  test("GET /api/products/:id (alias en inglés) debe responder 200 con el producto", async () => {
    const res = await fetch(`${baseUrl}/api/products/${createdProduct._id}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data._id, createdProduct._id);
  });

  // 8. PUT - Actualizar producto (UPDATE)
  test("PUT /api/productos/:id debe actualizar los campos del producto con código 200", async () => {
    assert.ok(createdProduct, "Se requiere el producto creado previamente");
    const updatePayload = {
      price: 159000,
      stock: 8,
      description: "Descripción actualizada para la mesa de centro.",
    };

    const res = await fetch(`${baseUrl}/api/productos/${createdProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    assert.equal(res.status, 200);
    const updated = await res.json();
    assert.equal(updated.price, 159000);
    assert.equal(updated.stock, 8);
    assert.equal(updated.description, updatePayload.description);
  });

  // 9. DELETE - Eliminar producto (DELETE)
  test("DELETE /api/productos/:id debe eliminar el producto con código 200", async () => {
    assert.ok(createdProduct, "Se requiere el producto creado previamente");
    const res = await fetch(`${baseUrl}/api/productos/${createdProduct._id}`, {
      method: "DELETE",
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes("deleted") || data.message.includes("eliminado"));
  });

  // 10. GET tras eliminación debe responder 404
  test("GET /api/productos/:id tras eliminarlo debe responder 404", async () => {
    const res = await fetch(`${baseUrl}/api/productos/${createdProduct._id}`);
    assert.equal(res.status, 404);
  });
});

