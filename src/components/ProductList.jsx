import ProductCard from "./ProductCard";

function ProductList({ productos = [], titulo, onAgregar }) {
  return (
    <section className="featured">
      <div className="container">
        {titulo && <h2 className="section-title">{titulo}</h2>}

        <div className="products-grid">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductList;