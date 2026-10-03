import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carrito from "./components/Carrito";
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
  // estado del carrito
  const [carrito, setCarrito] = useState([]);

  // estado para mostrar el modal del carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // función para agregar un producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!producto || producto.id === undefined) return;
    const cantidadNumerica = Math.max(1, Number(cantidad) || 1);

    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => Number(item.id) === Number(producto.id)
      );

      if (existe) {
        return prevCarrito.map((item) =>
          Number(item.id) === Number(producto.id)
            ? { ...item, cantidad: item.cantidad + cantidadNumerica }
            : item
        );
      }

      return [...prevCarrito, { ...producto, cantidad: cantidadNumerica }];
    });
  };

  // función para eliminar un producto del carrito por su ID
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => Number(item.id) !== Number(id))
    );
  };

  // función para vaciar completamente el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // contador de productos
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <Navbar
        cantidadCarrito={cantidadTotal}
        onAbrirCarrito={() => setMostrarCarrito(true)}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Inicio productos={productosPrueba} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/productos"
            element={<Productos productos={productosPrueba} onAgregar={agregarAlCarrito} />}
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/productos/:id"
            element={<ProductoDetalle productos={productosPrueba} onAgregar={agregarAlCarrito} />}
          />
        </Routes>
      </main>

      {/* Vista modal del carrito */}
      {mostrarCarrito && (
        <Carrito
          carrito={carrito}
          onEliminar={eliminarDelCarrito}
          onVaciar={vaciarCarrito}
          onCerrar={() => setMostrarCarrito(false)}
        />
      )}

      <Footer />
    </>
  );
}

export default App
