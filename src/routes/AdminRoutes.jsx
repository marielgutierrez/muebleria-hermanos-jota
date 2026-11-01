import { Routes, Route } from "react-router-dom";
import AdminProductos from "../pages/AdminProductos";
import AdminCrearProducto from "../pages/AdminCrearProducto";
import AdminEditarProducto from "../pages/AdminEditarProducto";

function AdminRoutes({ onProductoModificado }) {
  return (
    <Routes>
      {/* Vista general del panel de administración */}
      <Route
        index
        element={<AdminProductos onProductoModificado={onProductoModificado} />}
      />
      <Route
        path="productos"
        element={<AdminProductos onProductoModificado={onProductoModificado} />}
      />

      {/* Ruta para creacion de producto */}
      <Route
        path="crear-producto"
        element={<AdminCrearProducto onProductoCreado={onProductoModificado} />}
      />

      {/* Ruta para edición de producto */}
      <Route
        path="editar-producto/:id"
        element={<AdminEditarProducto onProductoActualizado={onProductoModificado} />}
      />
      <Route
        path="productos/editar/:id"
        element={<AdminEditarProducto onProductoActualizado={onProductoModificado} />}
      />
    </Routes>
  );
}

export default AdminRoutes;
export { AdminProductos, AdminCrearProducto, AdminEditarProducto };
