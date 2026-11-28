const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/hermanos-jota-test";
process.env.JWT_SECRET = "test_jwt_secret_key_hermanos_jota_sprint_7_8";

const app = require("../src/app");
const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");
const User = require("../src/models/User");
const Order = require("../src/models/Order");

let server;
let baseUrl;

let userA;
let tokenA;
let userB;
let tokenB;
let product1;
let product2;
let createdOrderId;

describe("Integrante 2 — Pruebas de Middleware, Seguridad y Pedidos Backend", () => {
  before(async () => {
    await connectDB();

    // Limpiar colecciones de prueba
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 1. Crear productos de prueba
    product1 = await Product.create({
      id: 101,
      name: "Sillón Copacabana Edición Test",
      category: "Living",
      material: "Cuero y acero",
      price: 180000,
      stock: 5,
      imageUrl: "/images/products/sillon-copacabana.png",
      description: "Sillón de prueba",
    });

    product2 = await Product.create({
      id: 102,
      name: "Mesa Minimalista Test",
      category: "Living",
      material: "Madera maciza",
      price: 50000,
      stock: 2,
      imageUrl: "/images/products/aparador-uspallata.png",
      description: "Mesa con poco stock para pruebas de límite",
    });

    // 2. Crear usuarios de prueba (Usuario A y Usuario B)
    userA = await User.create({
      name: "Ana Compradora",
      email: "ana@hermanosjota.com",
      password: "password123",
    });

    userB = await User.create({
      name: "Bruno Visitante",
      email: "bruno@hermanosjota.com",
      password: "password123",
    });

    tokenA = jwt.sign(
      { id: userA._id, email: userA.email, name: userA.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    tokenB = jwt.sign(
      { id: userB._id, email: userB.email, name: userB.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 3. Iniciar servidor HTTP en puerto aleatorio
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  // ========================================================
  // SUITE 1: MIDDLEWARE DE AUTENTICACIÓN Y SEGURIDAD
  // ========================================================

  test("1. Token ausente: debe responder 401 si no se envía header Authorization", async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ product: product1._id, quantity: 1 }] }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.message.includes("token"));
  });

  test("2. Formato de token inválido: debe responder 401 si no inicia con Bearer", async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${tokenA}`,
      },
      body: JSON.stringify({ items: [{ product: product1._id, quantity: 1 }] }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.message.includes("Bearer"));
  });

  test("3. Token inválido/corrupto: debe responder 401 si el JWT no es válido", async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token_completamente_falso_o_corrupto",
      },
      body: JSON.stringify({ items: [{ product: product1._id, quantity: 1 }] }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.message.toLowerCase().includes("inválido"));
  });

  test("4. Token expirado: debe responder 401 si el token ya venció", async () => {
    const expiredToken = jwt.sign(
      { id: userA._id, email: userA.email },
      process.env.JWT_SECRET,
      { expiresIn: "-1s" }
    );

    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${expiredToken}`,
      },
      body: JSON.stringify({ items: [{ product: product1._id, quantity: 1 }] }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.message.toLowerCase().includes("expirado"));
  });

  // ========================================================
  // SUITE 2: CREACIÓN DE PEDIDOS (POST /api/orders)
  // ========================================================

  test("5. Acceso autorizado y creación exitosa de pedido (POST /api/orders)", async () => {
    const stockInicial = product1.stock;

    const payload = {
      items: [
        {
          product: product1._id,
          quantity: 2,
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(payload),
    });

    assert.equal(res.status, 201);
    const data = await res.json();

    assert.ok(data.order);
    assert.equal(data.order.user.toString(), userA._id.toString());
    assert.equal(data.order.items.length, 1);
    assert.equal(data.order.items[0].quantity, 2);
    assert.equal(data.order.items[0].price, product1.price);

    // Validar cálculo del total en backend (180000 * 2 = 360000)
    assert.equal(data.order.total, 360000);
    assert.equal(data.order.status, "confirmado");

    createdOrderId = data.order._id || data.order.id;

    // Verificar que el stock se descontó en MongoDB (de 5 a 3)
    const productAfter = await Product.findById(product1._id);
    assert.equal(productAfter.stock, stockInicial - 2);
  });

  test("6. Validación: pedido con lista de items vacía debe responder 400", async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 400);
  });

  test("7. Validación: producto inexistente debe responder 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        items: [{ product: fakeId, quantity: 1 }],
      }),
    });

    assert.equal(res.status, 404);
  });

  test("8. Validación: cantidad mayor al stock disponible debe responder 400", async () => {
    // product2 tiene stock 2, intentamos comprar 5
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        items: [{ product: product2._id, quantity: 5 }],
      }),
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.message.toLowerCase().includes("insuficiente"));
  });

  // ========================================================
  // SUITE 3: CONSULTA DE PEDIDOS Y CONTROL DE ACCESO
  // ========================================================

  test("9. Consulta de pedidos propios (GET /api/orders/my-orders): devuelve pedidos del usuario autenticado", async () => {
    const res = await fetch(`${baseUrl}/api/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });

    assert.equal(res.status, 200);
    const orders = await res.json();
    assert.ok(Array.isArray(orders));
    assert.equal(orders.length, 1);
    assert.equal(orders[0].user.toString(), userA._id.toString());
  });

  test("10. Pedidos ajenos (GET /api/orders/my-orders): otro usuario NO ve los pedidos de usuarios ajenos", async () => {
    // Bruno (User B) no ha hecho pedidos aún
    const res = await fetch(`${baseUrl}/api/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });

    assert.equal(res.status, 200);
    const orders = await res.json();
    assert.ok(Array.isArray(orders));
    assert.equal(orders.length, 0); // User B no ve el pedido de User A
  });

  test("11. Pedido ajeno directo (GET /api/orders/:id): responder 403 al intentar acceder a pedido de otro", async () => {
    // Bruno intenta acceder directamente al ID del pedido de Ana
    const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}`, {
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });

    assert.equal(res.status, 403);
    const data = await res.json();
    assert.ok(data.message.toLowerCase().includes("autorización") || data.message.toLowerCase().includes("ajeno"));
  });

  test("12. Pedido propio directo (GET /api/orders/:id): responder 200 al dueño del pedido", async () => {
    const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}`, {
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });

    assert.equal(res.status, 200);
    const order = await res.json();
    assert.equal(order._id.toString(), createdOrderId.toString());
  });

  // ========================================================
  // SUITE 4: ENDPOINTS DE AUTENTICACIÓN (INTEGRACIÓN SPRINT 7/8)
  // ========================================================

  test("13. Registro de usuario (POST /api/auth/register): respuesta compatible sin password", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Carlos Prueba",
        email: "carlos@hermanosjota.com",
        password: "securepassword",
      }),
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.ok(data.token);
    assert.ok(data.user);
    assert.equal(data.user.email, "carlos@hermanosjota.com");
    assert.equal(data.user.password, undefined); // La contraseña NO debe devolverse
  });

  test("14. Login de usuario (POST /api/auth/login): respuesta con token JWT", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "carlos@hermanosjota.com",
        password: "securepassword",
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.message, "Login exitoso");
    assert.ok(data.token);
    assert.equal(data.user.email, "carlos@hermanosjota.com");
  });
});
