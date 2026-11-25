
// Dirección base de nuestra API
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");

// Función para procesar las respuestas del servidor
const procesarRespuesta = async (respuesta) => {
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(
      datos.message || datos.error || "Ocurrió un error en el servidor"
    );
  }

  return datos;
};

// REGISTRO
export const registrarUsuario = async (datosUsuario) => {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosUsuario),
  });

  return procesarRespuesta(respuesta);
};

// LOGIN
export const iniciarSesion = async (datosLogin) => {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosLogin),
  });

  return procesarRespuesta(respuesta);
};
