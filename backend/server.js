require('dotenv').config(); // Cargar las variables del archivo .env
const express = require("express");
const connectDB = require('./src/config/db'); // Traer la función de conexión

const app = express();

// Middleware
app.use(express.json());

// Soportar tanto /api/productos como /api/products para máxima compatibilidad
app.use("/api/productos", productosRoutes);
app.use("/api/products", productosRoutes);

// Usar el puerto que definieron en el grupo (4000)
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
