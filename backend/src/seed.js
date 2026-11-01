const path = require("path");
const Product = require("./models/Product");

const initialProducts = [
  {
    id: 1,
    name: "Sillón Copacabana",
    category: "Living",
    material: "Cuero curtido vegetal, acero pintado",
    price: 185000,
    measurements: "90 × 85 × 95 cm",
    imageUrl: "/images/products/sillon-copacabana.png",
    description: "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna, inspirado en la estética brasilera moderna de los 60.",
    stock: 1,
  },
  {
    id: 2,
    name: "Biblioteca Recoleta",
    category: "Almacenamiento",
    material: "Estructura de acero, estantes de roble",
    price: 232000,
    measurements: "100 × 35 × 200 cm",
    imageUrl: "/images/products/biblioteca-recoleta.png",
    description: "Sistema modular de estantes abierto con estructura Sage Green y repisas en roble claro, ideal para colecciones y objetos de diseño.",
    stock: 3,
  },
  {
    id: 3,
    name: "Aparador Uspallata",
    category: "Almacenamiento",
    material: "Nogal macizo FSC®, herrajes de latón",
    price: 210000,
    measurements: "180 × 45 × 75 cm",
    imageUrl: "/images/products/aparador-uspallata.png",
    description: "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón y silueta minimalista.",
    stock: 2,
  },
  {
    id: 4,
    name: "Butaca Mendoza",
    category: "Living",
    material: "Guatambú macizo, tela bouclé",
    price: 98000,
    measurements: "80 × 75 × 85 cm",
    imageUrl: "/images/products/butaca-mendoza.png",
    description: "Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú y respaldo curvo de máximo confort.",
    stock: 4,
  },
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(initialProducts);
      console.log("Catálogo inicial sembrado con éxito en MongoDB (4 productos cargados).");
    } else {
      console.log(`Base de datos lista: cuenta con ${count} productos.`);
    }
  } catch (error) {
    console.error("Error al sembrar productos:", error.message);
  }
};

if (require.main === module) {
  const dotenv = require("dotenv");
  const envPaths = [
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(process.cwd(), "backend/.env"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const p of envPaths) {
    dotenv.config({ path: p });
  }

  const connectDB = require("./config/db");
  connectDB()
    .then(async () => {
      await seedProducts();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedProducts;
