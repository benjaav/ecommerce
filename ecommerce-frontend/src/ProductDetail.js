// src/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { trackFacebookEvent } from './FacebookPixel';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  React.useEffect(() => {
    axios.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        trackFacebookEvent('ViewContent', {
          content_ids: [res.data.id],
          content_type: 'product',
          value: res.data.price,
          currency: 'CLP'
        });
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar el producto.');
      });
  }, [id]);

  function handleGoBack() {
    return navigate(-1);
  }

  const handleAddToCart = () => {
    const payload = { product_id: id, quantity: 1 };
    if (token && !isGuest) {
      axios.post('add-to-cart/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => navigate('/cart'))
        .catch(err => console.error(err));
    } else {
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const idx = local.findIndex(i => i.id === Number(id));
      if (idx >= 0) local[idx].quantity += 1;
      else local.push({
        id: Number(id),
        name: product.name,
        price: product.price,
        quantity: 1
      });
      localStorage.setItem('localCart', JSON.stringify(local));
      trackFacebookEvent('AddToCart', {
        content_ids: [id],
        content_type: 'product',
        value: product.price,
        currency: 'CLP'
      });
      navigate('/cart');
    }
  };

  if (error) return (
    <div><NavBar /><p style={{ color:'red', textAlign:'center' }}>{error}</p></div>
  );
  if (!product) return (
    <div><NavBar /><p style={{ textAlign:'center' }}>Cargando producto...</p></div>
  );

  return (
    <div className="container">
      <NavBar />
      <div className="detail-container">
        <button onClick={handleGoBack} className="back-btn">Volver</button>
        <div className="detail-header">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
        </div>
        <div className="detail-images">
          {product.images && product.images.length > 0
            ? product.images.map(imgObj => {
                const src = imgObj.image.startsWith('http')
                  ? imgObj.image
                  : `/media/${imgObj.image}`;
                return (
                  <img key={imgObj.id} src={src} alt={product.name} className="detail-img" />
                );
              })
            : <p>No hay imágenes para este producto.</p>
          }
        </div>
        <div className="detail-info">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>
        <button onClick={handleAddToCart} className="submit">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;