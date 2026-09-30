function Navbar({ cantidadCarrito = 0 }) {
  return (
    <header className="site-header">
      <div className="container header__inner">
        <div className="logo">
          <img
            src="./images/logo-HJ.png"
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
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Productos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </nav>

          <button
            type="button"
            className="cart-button"
            aria-label={`Ver carrito de compras, ${cantidadCarrito} productos`}
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
