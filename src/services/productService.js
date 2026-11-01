/**
 * Servicio para la gestión de productos (CRUD)
 * Conecta el frontend con la API de Express (GET, POST, PUT, DELETE)
 */

    export const getBaseUrl = () => {
      const envUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

      if (!envUrl || !envUrl.trim()) {
        return "http://localhost:4000/api/productos";
      }

      const clean = envUrl.trim().replace(/\/+$/, "");

      // Si la URL ya termina explícitamente en /productos o /products
      if (clean.endsWith("/productos") || clean.endsWith("/products")) {
        return clean;
      }

      // Si termina en /api
      if (clean.endsWith("/api")) {
        return `${clean}/productos`;
      }

      // Si es la URL raíz del servidor (ej: https://mi-backend.onrender.com)
      return `${clean}/api/productos`;
    };

    /**
     * Obtener todos los productos (GET)
     */
    export async function getProductos() {
      try {
        const res = await fetch(getBaseUrl());
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudieron obtener los productos.`);
        }
        return await res.json();
      } catch (err) {
        console.error("Error en getProductos:", err);
        throw err;
      }
    }

    /**
     * Obtener un producto por ID (GET)
     */
    export async function getProductoById(id) {
      try {
        const res = await fetch(`${getBaseUrl()}/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Producto no encontrado.");
          }
          throw new Error(`Error ${res.status}: No se pudo obtener el producto.`);
        }
        return await res.json();
      } catch (err) {
        console.error(`Error en getProductoById(${id}):`, err);
        throw err;
      }
    }

    /**
     * Crear un nuevo producto (POST)
     */
    export async function createProducto(productoData) {
      try {
          const res = await fetch(getBaseUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoData),
          });

          const data = await res.json().catch(() => null);

          if(!res.ok) {
            const errorMsg = data?.error || data?.message || `Error ${res.status} al crear el producto.`;
        throw new Error(errorMsg);
      }

    return data;
    } catch (err) {
      console.error("Error en createProducto:", err);
      throw err;
    }
  }

  /**
   * Actualizar un producto existente (PUT)
   */
  export async function updateProducto(id, productoData) {
    try {
        const res = await fetch(`${getBaseUrl()}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productoData),
        });

        const data = await res.json().catch(() => null);

        if(!res.ok) {
          const errorMsg = data?.error || data?.message || `Error ${res.status} al actualizar el producto.`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`Error en updateProducto(${id}):`, err);
    throw err;
  }
}

/**
 * Eliminar un producto (DELETE)
 */
export async function deleteProducto(id) {
  try {
      const res = await fetch(`${getBaseUrl()}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if(!res.ok) {
        const errorMsg = data?.error || data?.message || `Error ${res.status} al eliminar el producto.`;
    throw new Error(errorMsg);
  }

    return data;
} catch (err) {
  console.error(`Error en deleteProducto(${id}):`, err);
  throw err;
}
}

// Alias en inglés para máxima compatibilidad
export const getProducts = getProductos;
export const getProductById = getProductoById;
export const createProduct = createProducto;
export const updateProduct = updateProducto;
export const deleteProduct = deleteProducto;

export default {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBaseUrl,
};
