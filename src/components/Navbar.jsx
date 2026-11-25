
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar({ cantidadCarrito = 0, onAbrirCarrito }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container header__inner">
        <div className="logo">
          <img
            src="/images/logo-HJ.png"
            alt="imagen logo"
            className="logo__img"
            width="40"
            height="40"
          />
          <span className="logo__text">Hermanos Jota</span>
        </div>

        <div className="header__right">
          <nav className="main-nav" aria-label="Navegación principal">
            <ul className="main-nav__list">
              <li>
                <NavLink to="/" end>Inicio</NavLink>
              </li>
              <li>
                <NavLink to="/productos">Productos</NavLink>
              </li>
              <li>
                <NavLink to="/contacto">Contacto</NavLink>
              </li>
              <li>
                <NavLink to="/admin" className="nav-admin-link">
                  Admin
                </NavLink>
              </li>

              {!isAuthenticated ? (
                <>
                  <li>
                    <NavLink to="/login">Iniciar sesión</NavLink>
                  </li>
                  <li>
                    <NavLink to="/registro">Registrarse</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/perfil">
                      Mi perfil
                    </NavLink>
                  </li>
                  <li>
                    <li>
                      <NavLink to="/mis-pedidos">
                       Mis pedidos
                       </NavLink>
                       </li>
                    <span>Hola, {user?.name}</span>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <button
            type="button"
            className="cart-button"
            aria-label={`Ver carrito de compras, ${cantidadCarrito} productos`}
            onClick={onAbrirCarrito}
          >
            <span className="cart-button__icon" aria-hidden="true">🛒</span>
            <span className="cart-button__count">{cantidadCarrito}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
