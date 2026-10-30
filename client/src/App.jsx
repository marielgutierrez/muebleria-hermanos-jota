
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetallel";

// Productos de prueba temporales para la página de inicio
const productosPrueba = [
  {
    _id: "1",
    name: "Sillón Copacabana",
    price: 185000,
    imageUrl: "/images/products/sillon-copacabana.png",
    description:
      "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna.",
  },
  {
    _id: "2",
    name: "Rack",
    price: 180000,
    imageUrl: "https://via.placeholder.com/300",
    description: "Rack para living.",
  },
  {
    _id: "3",
    name: "Mesa",
    price: 180000,
    imageUrl: "https://via.placeholder.com/300",
    description: "Mesa de diseño.",
  },
];

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Inicio productos={productosPrueba} />}
          />

          <Route
            path="/productos"
            element={<Productos />}
          />

          <Route
            path="/productos/:id"
            element={<ProductoDetalle />}
          />

          <Route
            path="/contacto"
            element={<Contacto />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
