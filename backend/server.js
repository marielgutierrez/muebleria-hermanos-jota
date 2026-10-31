const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const productosRoutes = require("./routes/productos.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// Soportar tanto /api/productos como /api/products para máxima compatibilidad
app.use("/api/productos", productosRoutes);
app.use("/api/products", productosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
