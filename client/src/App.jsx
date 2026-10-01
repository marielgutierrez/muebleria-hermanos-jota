import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetallel";

// DATOS DE PRUEBA TEMPORALES
// TODO: Reemplazar por los productos obtenidos mediante fetch de la API.
const productosPrueba = [
  {
    id: 1,
    name: "Sillón Copacabana",
    category: "Living",
    material: "Cuero curtido vegetal, acero pintado",
    price: 185000,
    image: "/images/products/sillon-copacabana.png",
    description: "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna.",
  },
  {
    id: 2,
    name: "Rack",
    price: 180000,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "Mesa",
    price: 180000,
    image: "https://via.placeholder.com/300",
  },
];

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Inicio productos={productosPrueba} />} />
          <Route path="/productos" element={<Productos productos={productosPrueba} />} />
          <Route path="/contacto" element={<Contacto />} />
             <Route path="/productos/:id" element={<ProductoDetalle productos={productosPrueba} />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
