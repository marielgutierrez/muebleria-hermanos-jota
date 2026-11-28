import { useAuth } from "../context/useAuth";

function Perfil() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="perfil-container">
        <h1>Mi perfil</h1>
        <p>No se encontraron datos del usuario.</p>
      </section>
    );
  }

  return (
    <section className="perfil-container">
      <h1>Mi perfil</h1>

      <div className="perfil-info">
        <h2>¡Hola, {user.name}!</h2>

        <p>
          <strong>Nombre:</strong> {user.name}
        </p>

        <p>
          <strong>Correo electrónico:</strong> {user.email}
        </p>
      </div>
    </section>
  );
}

export default Perfil;
