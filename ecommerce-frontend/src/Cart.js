// src/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({}); // Guarda la cantidad editable por ítem
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // Función para recargar el carrito
  const fetchCart = () => {
    axios.get('auth/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
      .then((response) => {
        setCart(response.data);
        // Inicializa las cantidades con el valor actual de cada ítem
        const initialQuantities = {};
        response.data.items.forEach(item => {
          initialQuantities[item.id] = item.quantity;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => {
        console.error("Error al obtener el carrito:", err);
        setError("Error al cargar el carrito, por favor inicia sesión.");
      });
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Manejar cambio de cantidad en el input
  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  // Actualiza la cantidad con una petición PATCH
  const handleUpdateQuantity = (itemId) => {
    axios.patch('cartitem/${itemId}/', 
        { quantity: quantities[itemId] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setMessage("Cantidad actualizada.");
        fetchCart();
      })
      .catch((err) => {
        console.error("Error al actualizar la cantidad:", err);
        setMessage("Error al actualizar la cantidad.");
      });
  };

  // Elimina el ítem del carrito
  const handleRemoveItem = (itemId) => {
    axios.delete('cartitem/${itemId}/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setMessage("Producto eliminado.");
        fetchCart();
      })
      .catch((err) => {
        console.error("Error al eliminar el producto:", err);
        setMessage("Error al eliminar el producto.");
      });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container">
      <NavBar />
      <h2>Mi Carrito</h2>
      {error && <p className="cart-error">{error}</p>}
      {message && <p style={{ color: '#00ffcc', textAlign: 'center' }}>{message}</p>}

      <div className="form-container">
        {!cart ? (
          <p>Cargando carrito...</p>
        ) : cart.items.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.items.map((item) => {
                const product = item.product;
                
                // Construir URL de la imagen
                let imageUrl = '';
                if (product.images && product.images.length > 0) {
                  const imgPath = product.images[0].image;
                  imageUrl = imgPath.startsWith('http') || imgPath.startsWith('/')
                    ? imgPath
                    : `https://codestorebl.com/media/${imgPath}`;
                }

                return (
                  <li key={item.id} className="cart-item">
  {imageUrl && (
    <img
      src={imageUrl}
      alt={product.name}
      className="cart-product-image"
    />
  )}
  <div style={{ flex: 1 }}>
    <span className="cart-item-name">{product.name}</span>
    <div className="quantity-controls">
      <input
        type="number"
        min="1"
        value={quantities[item.id] || item.quantity}
        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
        className="quantity-input"
      />
      <button onClick={() => handleUpdateQuantity(item.id)} className="update-btn">
        Actualizar
      </button>
      <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
        Eliminar
      </button>
    </div>
  </div>
  {/* Bloque de precio con nuevo diseño */}
  <div className="cart-price-info">
    <div className="price-line">
      <span className="qty">{item.quantity}</span>
      <span className="multiply">&times;</span>
      <span className="unit-price">${Number(product.price).toFixed(0)}</span>
    </div>
    <div className="total-line">
      <strong>Total:</strong>
      ${ (item.quantity * Number(product.price)).toFixed(0) }
    </div>
  </div>
</li>

                );
              })}
            </ul>
            <button onClick={handleCheckout} className="submit">
              Proceder al Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
