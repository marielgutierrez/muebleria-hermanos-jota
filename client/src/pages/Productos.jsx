import ProductList from "../components/ProductList";
import Hero from "../components/Hero";


function Productos({ productos = [] }) {
  return (
    <>
    <Hero
  eyebrow="Catálogo Oficial · Colección Completa"
  titulo="Muebles con Historia"
  subtitulo="Cada pieza es concebida y ensamblada en nuestra Casa Taller con maderas nativas argentinas, técnicas de ebanistería tradicional y acabados de bajo impacto ambiental. Hacé clic en cualquier pieza para conocer sus detalles de fabricación e historia."
/>
    <ProductList productos={productos} titulo="Nuestros productos" />
  </>
  );
}

export default Productos;
