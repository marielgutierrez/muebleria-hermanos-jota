
// Dirección de la API de productos
const API_URL = "http://localhost:4000/api/productos";

// Obtener todos los productos
export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return await response.json();
}

// Obtener un producto por su ID
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }

  return await response.json();
}

// Crear un producto
export async function createProduct(productData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el producto");
  }

  return await response.json();
}

// Actualizar un producto
export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  return await response.json();
}

// Eliminar un producto
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }

  return true;
}
