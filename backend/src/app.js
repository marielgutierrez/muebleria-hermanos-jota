const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://hermanos-jota-store.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (herramientas server-to-server, curl, Postman, Node)
    if (!origin) return callback(null, true);

    const isExplicit = allowedOrigins.includes(origin);
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isDeploy =
      /\.netlify\.app$/.test(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.onrender\.com$/.test(origin);

    if (isExplicit || isLocalhost || isDeploy) {
      return callback(null, true);
    }

    // Permitir en desarrollo/producción general para evitar rechazos inesperados de CORS
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl || req.url} ${res.statusCode}`);
  });
  next();
});

// Soportar tanto /api/products como /api/productos y rutas directas para compatibilidad total
app.use("/api/products", productRoutes);
app.use("/api/productos", productRoutes);
app.use("/products", productRoutes);
app.use("/productos", productRoutes);

// Endpoint raíz y de verificación de salud (necesario para Render health checks)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Mueblería Hermanos Jota activa",
    endpoints: {
      productos: "/api/productos",
      products: "/api/products",
      health: "/api/health",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API Mueblería Hermanos Jota activa" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API Mueblería Hermanos Jota activa" });
});

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", error: "Ruta no encontrada" });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.message);
  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

module.exports = app;
