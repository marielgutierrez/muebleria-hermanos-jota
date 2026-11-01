require('dotenv').config(); // Cargar las variables del archivo .env
const express = require("express");
const connectDB = require('./src/config/db'); // Traer la función de conexión

const app = express();

// Middleware
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Usar el puerto que definieron en el grupo (4000)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});