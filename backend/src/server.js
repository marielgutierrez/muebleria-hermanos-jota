require("dotenv").config();

const app = require("./app");

let connectDB;
try {
  connectDB = require("../config/db");
} catch (error) {
  connectDB = require("./config/db");
}

let Product;
try {
  Product = require("../models/Product");
} catch (error) {
  Product = require("./models/Product");
}

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
