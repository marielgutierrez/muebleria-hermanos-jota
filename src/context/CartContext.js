import { createContext } from "react";

// Contexto del carrito — se importa tanto en CartContext.jsx (Provider)
// como en useCart.js (hook). Separado para cumplir la regla
// react-refresh/only-export-components de ESLint.
const CartContext = createContext(null);

export default CartContext;
