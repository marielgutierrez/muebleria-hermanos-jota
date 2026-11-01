import { Link } from "react-router-dom";

// Componente para mostrar y gestionar los elementos del carrito de compras
function Carrito({
  carrito,
  onEliminar,
  onVaciar,
  onCerrar,
  onCambiarCantidad,
}) {
  // Calculamos el precio total sumando el subtotal de cada producto
  const total = carrito.reduce(
    (acumulador, item) =>
      acumulador + Number(item.price || item.precio || 0) * item.cantidad,
    0
  );

  return (
    <div className="cart-overlay" onClick={onCerrar}>
      {/* Evitamos que el clic dentro del modal lo cierre */}
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del carrito */}
        <div className="cart-modal__header">
          <h2>Tu Carrito</h2>
          <button
            type="button"
            className="cart-modal__close-btn"
            onClick={onCerrar}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Contenido: lista de productos o mensaje de carrito vacío */}
        <div className="cart-modal__body">
          {carrito.length === 0 ? (
            <div className="cart-modal__empty">
              <span className="cart-modal__empty-icon" aria-hidden="true">🛒</span>
              <p>Tu carrito está vacío.</p>
              <Link
                to="/productos"
                className="btn btn--primary btn--small"
                onClick={onCerrar}
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <ul className="cart-modal__list">
              {carrito.map((item) => {
                const nombre = item.name || item.nombre;
                const precio = Number(item.price || item.precio || 0);
                const imagen = item.image || item.imageUrl || item.imagen;
                const stockItem = item.stock !== undefined ? Number(item.stock) : 5;
                const alMaximoStock = item.cantidad >= stockItem;

                return (
                  <li key={item.id} className="cart-item">
                    <img
                      src={imagen}
                      alt={nombre}
                      className="cart-item__image"
                      onError={(e) => {
                        e.target.src = "/images/products/sillon-copacabana.png";
                      }}
                    />
                    <div className="cart-item__details">
                      <h3 className="cart-item__name">{nombre}</h3>
                      <p className="cart-item__price">
                        ${precio.toLocaleString("es-AR")} c/u
                      </p>

                      {/* Control de cantidad dentro del carrito que respeta el stock */}
                      <div className="cart-item__qty-wrapper">
                        <div className="cart-item__qty-controls">
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => onCambiarCantidad?.(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="cart-item__qty-number">{item.cantidad}</span>
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => onCambiarCantidad?.(item.id, item.cantidad + 1)}
                            disabled={alMaximoStock}
                            aria-label="Aumentar cantidad"
                            title={alMaximoStock ? "Stock máximo alcanzado" : "Aumentar cantidad"}
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item__stock-indicator">
                          (máx. {stockItem} u.)
                        </span>
                      </div>

                      <p className="cart-item__subtotal">
                        Subtotal: ${(precio * item.cantidad).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="cart-item__delete-btn"
                      onClick={() => onEliminar(item.id)}
                      aria-label={`Eliminar ${nombre} del carrito`}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pie del carrito con resumen y acciones */}
        {carrito.length > 0 && (
          <div className="cart-modal__footer">
            <div className="cart-modal__total">
              <span>Total:</span>
              <strong>${total.toLocaleString("es-AR")}</strong>
            </div>

            <div className="cart-modal__actions">
              <button
                type="button"
                className="btn btn--outline btn--small"
                onClick={onVaciar}
              >
                Vaciar carrito
              </button>
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={() => alert("¡Gracias por tu compra en Hermanos Jota!")}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
