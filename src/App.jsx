import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carrito from "./components/Carrito";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetallel";

// Componentes y Rutas del Panel de Administración (Integrante 4)
import AdminRoutes, {
  AdminProductos,
  AdminCrearProducto,
  AdminEditarProducto,
} from "./routes/AdminRoutes";
import { getProductos } from "./services/productService";

function App() {
  // Estados para la carga de productos de la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del carrito
  const [carrito, setCarrito] = useState([]);
  // Estado para mostrar el modal del carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

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

  // Función para agregar un producto al carrito respetando el límite de stock
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const id = producto?.id !== undefined ? producto.id : producto?._id;
    if (id === undefined) return false;

    const nombre = producto.name || producto.nombre || "esta pieza";
    const stock = Number(producto.stock !== undefined ? producto.stock : 5);

    // 1. Validar que el producto tenga stock disponible (> 0)
    if (stock <= 0) {
      alert(`Lo sentimos, "${nombre}" no tiene stock disponible en este momento.`);
      return false;
    }

    const cantidadNumerica = Math.max(1, Number(cantidad) || 1);

    // 2. Verificar cuánto ya existe en el carrito
    const itemExistente = carrito.find(
      (item) => Number(item.id || item._id) === Number(id)
    );
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;

    // 3. Validar que no supere el stock total
    if (cantidadActual >= stock) {
      alert(
        `No podés agregar más unidades de "${nombre}". Ya alcanzaste el stock máximo disponible (${stock} ${stock === 1 ? "unidad" : "unidades"}).`
      );
      return false;
    }

    if (cantidadActual + cantidadNumerica > stock) {
      const disponibles = stock - cantidadActual;
      alert(
        `No es posible agregar ${cantidadNumerica} unidades de "${nombre}". Solo podés agregar hasta ${disponibles} unidad(es) más para no superar el stock disponible de ${stock}.`
      );
      return false;
    }

    // 4. Agregar o actualizar cantidad
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => Number(item.id || item._id) === Number(id)
      );

      if (existe) {
        return prevCarrito.map((item) =>
       String(item.id || item._id) === String(id)
            ? { ...item, cantidad: item.cantidad + cantidadNumerica, stock }
            : item
        );
      }

      return [
        ...prevCarrito,
        {
          ...producto,
          id,
          cantidad: cantidadNumerica,
          stock,
        },
      ];
    });

    return true;
  };

  // Función para modificar la cantidad directamente desde el modal del carrito
  const cambiarCantidadCarrito = (id, nuevaCantidad) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) => {
        if (Number(item.id || item._id) === Number(id)) {
          const stock = Number(item.stock !== undefined ? item.stock : 5);
          // La cantidad no puede ser menor a 1 ni superar el stock disponible
          const cantidadClampeada = Math.max(1, Math.min(Number(nuevaCantidad) || 1, stock));
          return { ...item, cantidad: cantidadClampeada };
        }
        return item;
      })
    );
  };

  // Función para eliminar un producto del carrito por su ID
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => Number(item.id || item._id) !== Number(id))
    );
  };

  // Función para vaciar completamente el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Contador de productos en carrito
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

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
          {/* Rutas Públicas (Integrante 3) */}
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

          {/* Rutas del Panel de Administración (Integrante 4) */}
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

      {/* Vista modal del carrito */}
      {mostrarCarrito && (
        <Carrito
          carrito={carrito}
          onEliminar={eliminarDelCarrito}
          onVaciar={vaciarCarrito}
          onCerrar={() => setMostrarCarrito(false)}
          onCambiarCantidad={cambiarCantidadCarrito}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
