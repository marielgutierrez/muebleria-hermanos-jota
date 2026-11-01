/**
 * Servicio para la gestión de productos (CRUD)
 * Conecta el frontend con la API de Express (GET, POST, PUT, DELETE)
 */

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "http://localhost:3000/api/productos";
  if (envUrl.endsWith("/productos") || envUrl.endsWith("/products")) {
    return envUrl;
  }
  return `${envUrl.replace(/\/$/, "")}/productos`;
};

const API_BASE = getBaseUrl();

/**
 * Obtener todos los productos (GET)
 */
export async function getProductos() {
  try {
    const res = await fetch(API_BASE);
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
    const res = await fetch(`${API_BASE}/${id}`);
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
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
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
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
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
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
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
