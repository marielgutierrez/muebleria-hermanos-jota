const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl || req.url} ${res.statusCode}`);
  });
  next();
});

// Soportar tanto /api/products como /api/productos para compatibilidad total
app.use("/api/products", productRoutes);
app.use("/api/productos", productRoutes);

// Endpoint de verificación de estado
app.get("/api/health", (req, res) => {
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
