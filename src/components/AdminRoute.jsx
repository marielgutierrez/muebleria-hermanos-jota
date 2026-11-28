import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AdminRoute() {
  const { isAuthenticated, authLoading, user } = useAuth();

  // Esperamos a que se recupere la sesión
  if (authLoading) {
    return <p>Verificando permisos...</p>;
  }

  // Si no inició sesión, lo enviamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si inició sesión pero no es administrador, vuelve al inicio
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, puede continuar
  return <Outlet />;
}

export default AdminRoute;