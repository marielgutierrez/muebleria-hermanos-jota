import { useState, useEffect, useCallback, useMemo } from "react";
import CartContext from "./CartContext";

const STORAGE_KEY = "hj_carrito";

// Lee el carrito guardado en localStorage al iniciar
function leerCarritoGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * CartProvider — envuelve la app y expone el estado global del carrito.
 * Persiste en localStorage automáticamente y valida stock contra el catálogo en tiempo real.
 */
function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [alertasStock, setAlertasStock] = useState([]);

  // Persistir en localStorage cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  // ── Chequeo del carrito al actualizarse el inventario ──────────────────────
  const sincronizarConInventario = useCallback((catalogo) => {
    if (!catalogo || !Array.isArray(catalogo) || catalogo.length === 0) return;

    setCarrito((prevCarrito) => {
      if (prevCarrito.length === 0) {
        setAlertasStock([]);
        return prevCarrito;
      }

      const nuevasAlertas = [];
      let huboCambios = false;

      const carritoActualizado = prevCarrito.map((item) => {
        const prodId = String(item.id ?? item._id);
        const productoEnCatalogo = catalogo.find(
          (p) => String(p.id ?? p._id) === prodId
        );

        const nombre =
          productoEnCatalogo?.name ||
          productoEnCatalogo?.nombre ||
          item.name ||
          item.nombre ||
          "Producto";

        if (!productoEnCatalogo) {
          // El producto fue eliminado del catálogo
          nuevasAlertas.push(`"${nombre}" ya no está disponible en el catálogo.`);
          if (item.stock !== 0) huboCambios = true;
          return { ...item, stock: 0 };
        }

        const stockActual = Number(productoEnCatalogo.stock ?? 0);
        const precioActual = Number(
          productoEnCatalogo.price ?? productoEnCatalogo.precio ?? item.price ?? 0
        );

        if (stockActual <= 0) {
          nuevasAlertas.push(`"${nombre}" se encuentra actualmente sin stock disponible.`);
          if (item.stock !== 0) huboCambios = true;
          return { ...item, stock: 0, price: precioActual };
        }

        if (item.cantidad > stockActual) {
          nuevasAlertas.push(
            `"${nombre}": solo quedan ${stockActual} unidades disponibles (tu carrito tiene ${item.cantidad}).`
          );
          if (item.stock !== stockActual) huboCambios = true;
          return { ...item, stock: stockActual, price: precioActual };
        }

        if (item.stock !== stockActual || item.price !== precioActual) {
          huboCambios = true;
        }

        return { ...item, stock: stockActual, price: precioActual };
      });

      setAlertasStock(nuevasAlertas);
      return huboCambios ? carritoActualizado : prevCarrito;
    });
  }, []);

  const limpiarAlertasStock = useCallback(() => {
    setAlertasStock([]);
  }, []);

  // ── Verificación de stock bloqueante ───────────────────────────────────────
  // Si algún producto tiene stock 0 o la cantidad en el carrito supera el stock, se bloquea la compra
  const hayProblemasDeStock = useMemo(() => {
    return carrito.some(
      (item) => Number(item.stock ?? 5) <= 0 || item.cantidad > Number(item.stock ?? 5)
    );
  }, [carrito]);

  // ── Agregar producto ──────────────────────────────────────────────────────
  const agregarAlCarrito = useCallback((producto, cantidad = 1) => {
    const id = producto?.id !== undefined ? producto.id : producto?._id;
    if (id === undefined) return false;

    const nombre = producto.name || producto.nombre || "este producto";
    const stock = Number(producto.stock !== undefined ? producto.stock : 5);

    if (stock <= 0) {
      alert(`Lo sentimos, "${nombre}" no tiene stock disponible.`);
      return false;
    }

    const cantidadNumerica = Math.max(1, Number(cantidad) || 1);

    setCarrito((prev) => {
      const existente = prev.find(
        (item) => String(item.id ?? item._id) === String(id)
      );
      const cantidadActual = existente ? existente.cantidad : 0;

      if (cantidadActual >= stock) {
        alert(
          `No podés agregar más unidades de "${nombre}". Stock máximo: ${stock}.`
        );
        return prev;
      }

      const nuevaCantidad = Math.min(cantidadActual + cantidadNumerica, stock);

      if (existente) {
        return prev.map((item) =>
          String(item.id ?? item._id) === String(id)
            ? { ...item, cantidad: nuevaCantidad, stock }
            : item
        );
      }

      return [
        ...prev,
        { ...producto, id, cantidad: Math.min(cantidadNumerica, stock), stock },
      ];
    });

    return true;
  }, []);

  // ── Eliminar producto ─────────────────────────────────────────────────────
  const eliminarDelCarrito = useCallback((id) => {
    setCarrito((prev) =>
      prev.filter((item) => String(item.id ?? item._id) !== String(id))
    );
  }, []);

  // ── Cambiar cantidad ──────────────────────────────────────────────────────
  const cambiarCantidad = useCallback((id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (String(item.id ?? item._id) !== String(id)) return item;
        const stock = Number(item.stock ?? 5);
        // Evitar cantidades inválidas: mínimo 1, máximo stock (si stock > 0)
        const maximoPermitido = Math.max(1, stock);
        const cantidad = Math.max(1, Math.min(Number(nuevaCantidad) || 1, maximoPermitido));
        return { ...item, cantidad };
      })
    );
  }, []);

  // ── Vaciar carrito ────────────────────────────────────────────────────────
  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
    setAlertasStock([]);
  }, []);

  // ── Totales ───────────────────────────────────────────────────────────────
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const subtotal = carrito.reduce(
    (acc, item) => acc + Number(item.price ?? item.precio ?? 0) * item.cantidad,
    0
  );

  const total = subtotal;

  const value = {
    carrito,
    mostrarCarrito,
    setMostrarCarrito,
    alertasStock,
    hayProblemasDeStock,
    sincronizarConInventario,
    limpiarAlertasStock,
    agregarAlCarrito,
    eliminarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
    cantidadTotal,
    subtotal,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
