const path = require("path");
const dotenv = require("dotenv");

// Cargar variables de entorno desde backend/.env o la raíz del proyecto
const envPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const p of envPaths) {
  dotenv.config({ path: p });
}

const app = require("./app");
const connectDB = require("./config/db");
const seedProducts = require("./seed");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    await seedProducts();
    app.listen(PORT, () => {
      console.log(`Servidor de Hermanos Jota funcionando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
