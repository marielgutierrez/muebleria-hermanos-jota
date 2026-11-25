
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // Esperamos a que termine de comprobarse la sesión
  if (authLoading) {
    return <p>Verificando sesión...</p>;
  }

  // Si no inició sesión, lo enviamos al login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Si está autenticado, permitimos que continúe
  return <Outlet />;
}

export default ProtectedRoute;
