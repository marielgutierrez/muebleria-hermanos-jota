import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  iniciarSesion,
  registrarUsuario,
} from "../services/authService";

export function AuthProvider({ children }) {
  // Estados de autenticación
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Controla si estamos recuperando la sesión inicial
  const [authLoading, setAuthLoading] = useState(true);

  // Recuperamos la sesión al cargar la aplicación
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem("user");
      const tokenGuardado = localStorage.getItem("token");

      if (usuarioGuardado && tokenGuardado) {
        setUser(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Registrar un usuario
  const register = async (datosUsuario) => {
    return await registrarUsuario(datosUsuario);
  };

  // Iniciar sesión
  const login = async (datosLogin) => {
  const respuesta = await iniciarSesion(datosLogin);

  if (!respuesta.token || !respuesta.user) {
    throw new Error("La respuesta del servidor no es válida");
  }

  const { token, user } = respuesta;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  setToken(token);
  setUser(user);

  return user;
};
  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        authLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
