import { useContext } from "react";
import CartContext from "./CartContext";

// Hook para consumir el CartContext desde cualquier componente
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>");
  }
  return ctx;
}

export default useCart;
