import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null); 
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get('products/')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error al cargar productos:", error));
  }, []);

  const handleAddToCart = (e, productId) => {
    e.stopPropagation(); 
    if (!token) return;
  
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
      <NavBar/>
      <h2 className="header">Lista de Productos</h2>

      <div className="product-grid">
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
