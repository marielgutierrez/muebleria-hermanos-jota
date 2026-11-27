import { useState } from "react";
import { Link } from "react-router-dom";
import { crearPedido } from "../services/orderService";
import useCart from "../context/useCart";

/**
 * CheckoutButton — botón de confirmar compra.
 * - Chequea stock y se bloquea si hay productos sin stock o con cantidad inválida.
 * - Envía el pedido al backend sin requerir login.
 * - Vacía el carrito solo cuando la compra se confirma exitosamente.
 * - Evita compras duplicadas por doble clic con estado de carga.
 * - Muestra confirmación visual inline y maneja errores.
 */
function CheckoutButton({ onCerrarCarrito }) {
  const {
    carrito,
    total,
    vaciarCarrito,
    hayProblemasDeStock,
    alertasStock,
  } = useCart();
  const [cargando, setCargando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState(null);

  const handleComprar = async () => {
    if (cargando || carrito.length === 0 || hayProblemasDeStock) return;

    setCargando(true);
    setError(null);

    const items = carrito.map((item) => ({
      productoId: String(item.id ?? item._id),
      nombre: item.name || item.nombre || "Producto",
      precio: Number(item.price ?? item.precio ?? 0),
      cantidad: item.cantidad,
    }));

    try {
      await crearPedido({ items, total });
      // Solo vaciar el carrito cuando la compra se confirma
      vaciarCarrito();
      setConfirmado(true);
      if (onCerrarCarrito) {
        setTimeout(onCerrarCarrito, 3000);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al procesar la compra.");
    } finally {
      setCargando(false);
    }
  };

  if (confirmado) {
    return (
      <div className="checkout-confirmado">
        <span className="checkout-confirmado__icon" aria-hidden="true">🎉</span>
        <h4 className="checkout-confirmado__titulo">¡Compra confirmada!</h4>
        <p className="checkout-confirmado__msg">
          Tu pedido fue registrado con éxito. Muchas gracias por confiar en Hermanos Jota.
        </p>
        <Link
          to="/mis-pedidos"
          className="btn btn--primary btn--small checkout-confirmado__link"
          onClick={onCerrarCarrito}
        >
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      {/* Aviso de stock insuficiente que bloquea la compra */}
      {hayProblemasDeStock && (
        <div className="checkout-stock-alert" role="alert">
          <p className="checkout-stock-alert__title">
            ⚠️ Compra pausada: stock insuficiente
          </p>
          <p className="checkout-stock-alert__text">
            {alertasStock.length > 0
              ? alertasStock[0]
              : "Uno o más productos en el carrito se quedaron sin stock. Modificá las cantidades o eliminalos para poder continuar."}
          </p>
        </div>
      )}

      {error && (
        <p className="checkout-error" role="alert">
          ⚠️ {error}
        </p>
      )}

      <button
        type="button"
        className={`btn btn--primary btn--checkout ${hayProblemasDeStock ? "btn--checkout-blocked" : ""}`}
        onClick={handleComprar}
        disabled={cargando || carrito.length === 0 || hayProblemasDeStock}
        aria-busy={cargando}
        title={
          hayProblemasDeStock
            ? "No podés comprar porque hay productos sin stock suficiente"
            : "Confirmar compra"
        }
      >
        {cargando
          ? "Procesando compra…"
          : hayProblemasDeStock
          ? "Compra bloqueada (sin stock)"
          : "Confirmar compra"}
      </button>
    </div>
  );
}

export default CheckoutButton;
