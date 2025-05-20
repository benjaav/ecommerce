import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, addToCart }) {
  let imageUrl = '';

  if (product.images && product.images.length > 0) {
    const imgPath = product.images[0].image;

    if (imgPath.startsWith('http') || imgPath.startsWith('/')) {
      imageUrl = imgPath;
    } else {
      imageUrl = `http://codestorebl.com/media/${imgPath}`;
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} />
        ) : (
          <div className="no-image">Sin imagen</div>
        )}
        <h3>{product.name}</h3>
      </Link>
      <p className="price">${product.price}</p>

      <button
        className="add-to-cart-btn"
        onClick={() => addToCart(product)}
      >
        ¡Agregar al carrito!
      </button>
    </div>
  );
}

export default ProductCard;
