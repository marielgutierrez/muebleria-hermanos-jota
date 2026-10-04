import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carrito from "./components/Carrito";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetallel";

function App() {
  // Estados para la carga de productos de la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del carrito
  const [carrito, setCarrito] = useState([]);
  // Estado para mostrar el modal del carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // PETICIÓN FETCH A LA API DE PRODUCTOS (Puerto 3000)
  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron obtener los productos del servidor");
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Función para agregar un producto al carrito
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

  // Función para eliminar un producto del carrito por su ID
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => Number(item.id) !== Number(id))
    );
  };

  // Función para vaciar completamente el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Contador de productos
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <Navbar
        cantidadCarrito={cantidadTotal}
        onAbrirCarrito={() => setMostrarCarrito(true)}
      />

      <main style={{ minHeight: "80vh", padding: "20px" }}>
        {/* Manejo de estados de Carga y Error */}
        {loading && <p style={{ textAlign: "center" }}>Cargando productos...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

        {!loading && !error && (
          <Routes>
            <Route
              path="/"
              element={<Inicio productos={productos} onAgregar={agregarAlCarrito} />}
            />
            <Route
              path="/productos"
              element={<Productos productos={productos} onAgregar={agregarAlCarrito} />}
            />
            <Route path="/contacto" element={<Contacto />} />
            <Route
              path="/productos/:id"
              element={<ProductoDetalle productos={productos} onAgregar={agregarAlCarrito} />}
            />
          </Routes>
        )}
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

export default App;
