
import { Link } from "react-router-dom";

function ProductCard({ producto }) {
  const { _id, name, description, price, imageUrl } = producto;

  return (
    <article className="product-card">
      <Link
        to={`/productos/${_id}`}
        className="product-card__image-wrap"
      >
        <img
          className="product-card__image"
          src={imageUrl}
          alt={name}
          loading="lazy"
        />
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>

        <p className="product-card__description">{description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">
            ${Number(price).toLocaleString("es-AR")}
          </span>

          <div className="product-card__actions">
            <Link
              to={`/productos/${_id}`}
              className="btn btn--outline btn--small"
            >
              Ver detalle
            </Link>

            <button
              type="button"
              className="btn btn--primary btn--small"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
