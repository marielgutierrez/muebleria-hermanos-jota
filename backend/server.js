const express = require("express");
const logger = require("./middleware/logger");
const productosRoutes = require("./routes/productos.routes");

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/productos", productosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});