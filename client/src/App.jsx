import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import Hero from "./components/Hero";
import Values from "./components/Values";

// DATOS DE PRUEBA TEMPORALES
// TODO: Reemplazar por los productos obtenidos mediante fetch de la API.
const productosPrueba = [
  {
    id: 1,
    nombre: "Sofá",
    precio: 250000,
    imagen: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    nombre: "Rack",
    precio: 180000,
    imagen: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    nombre: "Mesa",
    precio: 180000,
    imagen: "https://via.placeholder.com/300",
  },
];
function App() {

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        {/* cuando el integrante 4, integre el backend con el frontend, reemplazar productosPrueba por los productos obtenidos mediante fetch de la API. */}
        <ProductList productos={productosPrueba}   titulo="Piezas destacadas"/>
        <Values />
      </main>

      <Footer />
    </>
  )
}

export default App
