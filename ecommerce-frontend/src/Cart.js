// src/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // Load cart from API (si user) o localStorage (si invitado)
  const fetchCart = () => {
    if (token && !isGuest) {
      axios.get('cart/', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
        .then(res => {
          setCart(res.data);
          const initQ = {};
          res.data.items.forEach(i => initQ[i.id] = i.quantity);
          setQuantities(initQ);
        })
        .catch(err => {
          console.error("Error al obtener el carrito:", err);
          setError("Error al cargar el carrito, por favor inicia sesión.");
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
      setCart({ items: localCart });
      const initQ = {};
      localCart.forEach(i => initQ[i.id] = i.quantity);
      setQuantities(initQ);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, isGuest]);

  // Resto de handlers iguales, usando token & isGuest en lugar de sólo token
  const handleQuantityChange = (itemId, newQty) => {
    setQuantities(prev => ({ ...prev, [itemId]: newQty }));
  };

  const handleUpdateQuantity = (itemId) => {
    if (token && !isGuest) {
      axios.patch(`cartitem/${itemId}/`, { quantity: quantities[itemId] },
        { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setMessage("Cantidad actualizada.");
          fetchCart();
        })
        .catch(() => setMessage("Error al actualizar la cantidad."));
    } else {
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const updated = local.map(item =>
        item.id === itemId ? { ...item, quantity: quantities[itemId] } : item
      );
      localStorage.setItem('localCart', JSON.stringify(updated));
      setCart({ items: updated });
      setMessage("Cantidad actualizada.");
    }
  };

  const handleRemoveItem = (itemId) => {
    if (token && !isGuest) {
      axios.delete(`cartitem/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setMessage("Producto eliminado.");
          fetchCart();
        })
        .catch(() => setMessage("Error al eliminar el producto."));
    } else {
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const updated = local.filter(item => item.id !== itemId);
      localStorage.setItem('localCart', JSON.stringify(updated));
      setCart({ items: updated });
      setMessage("Producto eliminado.");
    }
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
              {cart.items.map(item => {
                const product = item.product || {};
                let imageUrl = '';
                if (product.images && product.images.length) {
                  const img = product.images[0].image;
                  imageUrl = img.startsWith('http') || img.startsWith('/')
                    ? img
                    : `https://codestorebl.com/media/${img}`;
                }
                return (
                  <li key={item.id} className="cart-item">
                    {imageUrl && <img src={imageUrl} alt={product.name} className="cart-product-image" />}
                    <div style={{ flex: 1 }}>
                      <span className="cart-item-name">{product.name || item.name}</span>
                      <div className="quantity-controls">
                        <input
                          type="number"
                          min="1"
                          value={quantities[item.id] || item.quantity}
                          onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                          className="quantity-input"
                        />
                        <button onClick={() => handleUpdateQuantity(item.id)} className="update-btn">Actualizar</button>
                        <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">Eliminar</button>
                      </div>
                    </div>
                    <div className="cart-price-info">
                      <div className="price-line">
                        <span className="qty">{item.quantity}</span>
                        <span className="multiply">&times;</span>
                        <span className="unit-price">${Number(product.price || item.price).toFixed(0)}</span>
                      </div>
                      <div className="total-line">
                        <strong>Total:</strong> ${(item.quantity * Number(product.price || item.price)).toFixed(0)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button onClick={handleCheckout} className="submit">Proceder al Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
