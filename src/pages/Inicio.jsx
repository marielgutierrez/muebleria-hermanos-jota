import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import Values from "../components/Values";
import { Link } from "react-router-dom";

function Inicio({ productos = [], onAgregar }) {
  return (
    <>
     <Hero
  eyebrow="Buenos Aires · Casa Taller"
  titulo={<>El redescubrimiento<br />de un arte olvidado</>}
  subtitulo="Creamos muebles que no solo sirven una función, sino que alimentan el alma. Existimos en la intersección entre herencia e innovación, donde la calidez del optimismo de los años 60 se encuentra con la conciencia de la sustentabilidad de hoy. Cada pieza cuenta una historia de artesanía que honra el pasado mientras abraza el futuro."
>
  <Link to="/productos" className="btn btn--primary">Ver productos</Link>
  <a href="#" className="btn btn--secondary">Conocé el taller</a>
</Hero>
      {/* cuando el integrante 4, integre el backend con el frontend, reemplazar productosPrueba por los productos obtenidos mediante fetch de la API. */}
      <ProductList
        productos={productos.slice(0, 3)}
        titulo="Piezas destacadas"
        onAgregar={onAgregar}
      />
      <Values />
    </>
  );
}

export default Inicio;
