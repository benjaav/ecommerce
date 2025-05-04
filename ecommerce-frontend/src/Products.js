import React, { useEffect, useState } from 'react';
import { trackFacebookEvent } from './FacebookPixel';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    setLoadingProgress(0);
    axios.get('products/', {
      onDownloadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLoadingProgress(percentCompleted);
        }
      }
    })
      .then(response => {
        if (response.data.results) {
          setProducts(response.data.results);
        } else {
          setProducts(response.data);
        }
        setLoadingProgress(100);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setLoadingProgress(100);
      });
  }, []);

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();

    if (!token) {
      let localCart = JSON.parse(localStorage.getItem('localCart')) || [];
      const existingItem = localCart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const product = products.find(p => p.id === productId);
        localCart.push({
          id: productId,
          quantity: 1,
          name: product ? product.name : '',
          price: product ? product.price : 0,
          images: product ? product.images : []
        });
      }
      localStorage.setItem('localCart', JSON.stringify(localCart));
      setSuccessMessage(productId);
      trackFacebookEvent('AddToCart', {
        content_ids: [productId],
        content_type: 'product',
        value: products.find(p => p.id === productId)?.price || 0,
        currency: 'CLP'
      });
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    axios.post('add-to-cart/', { product_id: productId, quantity: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setSuccessMessage(productId);
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch(error => {
        console.error("Error agregando al carrito:", error);
      });
  };

  return (
    <div className="container">
      <NavBar />
      <h2 className="header">Lista de Productos</h2>

      {loadingProgress < 100 && (
        <div className="loading-progress">
          Cargando productos... {loadingProgress}%
        </div>
      )}

      <div className="product-grid" style={{ opacity: loadingProgress < 100 ? 0.5 : 1 }}>
        {products.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].image}
                alt={product.name}
                className="product-image"
                loading="lazy"
              />
            )}
            <h3>{product.name}</h3>
            <p className="price">${parseInt(product.price)}</p>

            <button
              className="add-to-cart-btn"
              onClick={(e) => handleAddToCart(e, product.id)}
            >
              Agregar al Carrito
            </button>

            {successMessage === product.id && (
              <p className="success-message">¡Producto agregado con éxito!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
