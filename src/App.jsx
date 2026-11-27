import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carrito from "./components/Carrito";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetalle";
import CarritoPage from "./pages/Carrito";
import MisPedidos from "./pages/MisPedidos";

// Componentes y Rutas del Panel de Administración (Integrante 4)
import AdminRoutes, {
  AdminProductos,
  AdminCrearProducto,
  AdminEditarProducto,
} from "./routes/AdminRoutes";
import { getProductos } from "./services/productService";
import useCart from "./context/useCart";

function App() {
  // Estados para la carga de productos de la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrito global desde Context
  const {
    mostrarCarrito,
    setMostrarCarrito,
    agregarAlCarrito,
    cantidadTotal,
    sincronizarConInventario,
  } = useCart();

  // Función para cargar / recargar productos desde la API
  const cargarProductos = useCallback(async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los productos del servidor");
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Sincronizar y validar stock del carrito al cargar o actualizarse el catálogo de productos
  useEffect(() => {
    if (productos && productos.length > 0) {
      sincronizarConInventario(productos);
    }
  }, [productos, sincronizarConInventario]);

  return (
    <>
      <Navbar
        cantidadCarrito={cantidadTotal}
        onAbrirCarrito={() => setMostrarCarrito(true)}
      />

      <main style={{ minHeight: "80vh", padding: "20px 0" }}>
        {/* Manejo de estados de Carga y Error de inicio */}
        {loading && <p style={{ textAlign: "center", padding: "2rem" }}>Cargando catálogo...</p>}
        {error && (
          <div
            style={{
              maxWidth: "600px",
              margin: "2rem auto",
              textAlign: "center",
              color: "#c0392b",
              padding: "1.5rem",
              border: "1px solid #f5c6cb",
              borderRadius: "8px",
              background: "#fdf7f7",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>
              Aviso: {error}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              {import.meta.env.PROD
                ? "Si el backend en Render se encuentra suspendido por inactividad (plan gratuito), puede demorar unos 40 segundos en reactivarse. Verificá también que la variable VITE_API_URL apunte a la URL del backend en Render."
                : "Verificá que el backend esté corriendo en el puerto 4000 (cd backend && npm run dev / node server.js)."}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                cargarProductos();
              }}
              style={{
                marginTop: "1rem",
                padding: "8px 18px",
                backgroundColor: "#2c3e50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* Rutas de la aplicación */}
        <Routes>
          {/* Rutas Públicas */}
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

          {/* Rutas de carrito y pedidos */}
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />

          {/* Rutas del Panel de Administración */}
          <Route
            path="/admin/*"
            element={<AdminRoutes onProductoModificado={cargarProductos} />}
          />
          <Route
            path="/admin"
            element={<AdminProductos onProductoModificado={cargarProductos} />}
          />
          <Route
            path="/admin/productos"
            element={<AdminProductos onProductoModificado={cargarProductos} />}
          />
          <Route
            path="/admin/crear-producto"
            element={<AdminCrearProducto onProductoCreado={cargarProductos} />}
          />
          <Route
            path="/admin/editar-producto/:id"
            element={<AdminEditarProducto onProductoActualizado={cargarProductos} />}
          />
        </Routes>
      </main>

      {/* Modal del carrito */}
      {mostrarCarrito && (
        <Carrito onCerrar={() => setMostrarCarrito(false)} />
      )}

      <Footer />
    </>
  );
}

export default App;
