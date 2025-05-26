import React, { useEffect, useState } from 'react';
import { trackFacebookEvent } from './FacebookPixel';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './ProductDetail.css';

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="star full" viewBox="0 0 20 20" fill="#00ffcc" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M10 1.5l2.9 6 6.6.6-5 4.7 1.5 6.5-5.5-3-5.5 3 1.5-6.5-5-4.7 6.6-.6 2.9-6z"/>
        </svg>
      ))}
      {halfStar && (
        <svg className="star half" viewBox="0 0 20 20" fill="#00ffcc" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#00ffcc" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M10 1.5l2.9 6 6.6.6-5 4.7 1.5 6.5-5.5-3-5.5 3 1.5-6.5-5-4.7 6.6-.6 2.9-6z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="star empty" viewBox="0 0 20 20" fill="none" stroke="#00ffcc" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M10 1.5l2.9 6 6.6.6-5 4.7 1.5 6.5-5.5-3-5.5 3 1.5-6.5-5-4.7 6.6-.6 2.9-6z"/>
        </svg>
      ))}
    </span>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  useEffect(() => {
    axios.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setCurrentIndex(0);
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

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

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
    <div className="product-detail-container">
      <NavBar />
      <div className="detail-container">
        <button onClick={handleGoBack} className="back-btn">Volver</button>

        {/* Badges */}
        <div className="badges">
          <span className="badge premium">POCO STOCK</span>
          <span className="badge premium">CALIDAD PREMIUM</span>
        </div>

        {/* Product Title and Rating */}
        <div className="detail-header">
          <h2>{product.name}</h2>
          <div className="rating">
            <StarRating rating={4.8} />
            <span className="rating-count">+2482 Unidades Vendidas</span>
          </div>
        </div>

        {/* Price with discount */}
        <div className="price-section">
          {product.discount_price ? (
            <>
              <span className="discounted-price">${product.discount_price}</span>
              <span className="original-price">${product.price}</span>
              <span className="discount-label">¡Solo por Hoy!</span>
            </>
          ) : (
            <span className="discounted-price">${product.price}</span>
          )}
        </div>

        {/* Image carousel with thumbnails */}
        <div className="carousel-container">
          <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {product.images && product.images.length > 0
              ? product.images.map(imgObj => {
                  const src = imgObj.image.startsWith('http')
                    ? imgObj.image
                    : `/media/${imgObj.image}`;
                  return (
                    <img key={imgObj.id} src={src} alt={product.name} className="carousel-img" />
                  );
                })
              : <p>No hay imágenes para este producto.</p>
            }
          </div>
          {/* Thumbnails */}
          <div className="carousel-thumbnails">
            {product.images && product.images.length > 0 && product.images.map((imgObj, index) => {
              const src = imgObj.image.startsWith('http')
                ? imgObj.image
                : `/media/${imgObj.image}`;
              return (
                <img
                  key={imgObj.id}
                  src={src}
                  alt={`${product.name} miniatura ${index + 1}`}
                  className={`thumbnail-img ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => selectImage(index)}
                />
              );
            })}
          </div>
        </div>

        {/* Description with bullet points */}
        <div className="detail-info">
          <h3>Descripción</h3>
          <ul className="description-list">
            {product.description.split('\n').map((line, index) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              let emoji = '•';
              if (trimmed.toLowerCase().includes('natural')) emoji = '🌱';
              else if (trimmed.toLowerCase().includes('definida')) emoji = '✨';
              else if (trimmed.toLowerCase().includes('curvas')) emoji = '🍑';
              else if (trimmed.toLowerCase().includes('unidades')) emoji = '🟢';
              return <li key={index}>{emoji} {trimmed}</li>;
            })}
          </ul>
        </div>

        {/* Add to Cart Button */}
        <button onClick={handleAddToCart} className="submit">
          Agregar al carrito.
        </button>

        {/* Customer Review */}
        <div className="customer-review">
          <img src="/images/marcelo.png" alt="Marcela Benavente" className="review-avatar" />
          <div className="review-content">
            <p>Todo perfecto, buenos precios y el producto tal cual lo describen. Se nota que les importa el cliente.</p>
            <div className="reviewer-name-rating">
              <span className="reviewer-name">Marcelo Benavente</span>
              <StarRating rating={5} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;
