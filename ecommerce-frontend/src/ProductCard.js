// src/ProductCard.js
import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  // Debug: Imprime el arreglo de imágenes para verificar la estructura
  console.log("Product images:", product.images);

  let imageUrl = '';

  if (product.images && product.images.length > 0) {
    const imgPath = product.images[0].image;

    // Si la imagen ya incluye "http" o comienza con '/', asumimos que es la URL correcta.
    if (imgPath.startsWith('http') || imgPath.startsWith('/')) {
      imageUrl = imgPath;
    } else {
      // Si la imagen es solo el nombre o la ruta relativa sin "/" inicial,
      // se le antepone el host y el directorio de media.
      imageUrl = `http://https://codestorebl.com/media/${imgPath}`;
    }
  }

  return (
    <div className="product-card">
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} />
      ) : (
        <div className="no-image">Sin imagen</div>
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
    </div>
  );
}

export default ProductCard;
