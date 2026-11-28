import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
const location = useLocation();

const rutaAnterior = location.state?.from?.pathname || "/";
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para controlar el envío
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({ email, password });

      // Si el login fue exitoso, vamos al inicio
     navigate(rutaAnterior, { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}

export default Login;
