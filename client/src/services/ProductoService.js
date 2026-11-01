/**
 * Re-exporta productService para garantizar compatibilidad con imports que usan ProductoService.js
 */
export * from "./productService";
import productService from "./productService";
export default productService;
