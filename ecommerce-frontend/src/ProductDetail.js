// src/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './NavBar';
import './ProductDetail.css'; // <-- archivo CSS para el detalle (lo creas a tu gusto)

function ProductDetail() {
  const { id } = useParams();         // id del producto en la ruta
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://https://codestorebl.com/api/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("Error al cargar el producto:", err);
        setError('No se pudo cargar el producto.');
      });
  }, [id]);

  if (error) {
    return (
      <div>
        <Header />
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <p style={{ textAlign: 'center' }}>Cargando producto...</p>
      </div>
    );
  }

  // product.images => [{id:..., image:...}, ...]
  // product.description => texto largo
  // product.name => "Set Lavaplatos..."
  // etc.

  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior (lista de productos)
  };

  return (
    <div className="container">
      <Header />
      <div className="detail-container">
        <button onClick={handleGoBack} className="back-btn">Volver</button>

        <div className="detail-header">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
        </div>

        <div className="detail-images">
          {product.images && product.images.length > 0 ? (
            product.images.map((imgObj) => {
              // Construimos URL completa si no viene con la ruta absoluta
              const imgUrl = imgObj.image.startsWith('http') || imgObj.image.startsWith('/')
                ? imgObj.image
                : `http://https://codestorebl.com/media/${imgObj.image}`;

              return (
                <img
                  key={imgObj.id}
                  src={imgUrl}
                  alt={product.name}
                  className="detail-img"
                />
              );
            })
          ) : (
            <p>No hay imágenes para este producto.</p>
          )}
        </div>

        <div className="detail-info">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
