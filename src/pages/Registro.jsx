
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Registro() {
 const { register } = useAuth();
const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para controlar el envío
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");
    setLoading(true);

    try {
     await register({ name, email, password });

      setMensaje("¡Cuenta creada correctamente!");

      // Después del registro, vamos al login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="registro-container">
      <h1>Crear una cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
          />
        </div>

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
            placeholder="Creá una contraseña"
            required
            minLength={6}
          />
        </div>

        {error && <p role="alert">{error}</p>}
        {mensaje && <p role="status">{mensaje}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>
    </section>
  );
}

export default Registro;
