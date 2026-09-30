
function ProductCard({ nombre, precio, imagen }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={imagen}
          alt={nombre}
        />
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{nombre}</h3>

        <p className="product-card__price">${precio}</p>
      </div>
    </article>
  );
}

export default ProductCard;