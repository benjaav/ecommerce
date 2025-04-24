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

  const token   = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // Carga del carrito: API si auth, localStorage si invitado
  const fetchCart = async () => {
    if (token && !isGuest) {
      try {
        const res = await axios.get('cart/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setCart(res.data);
        const initQ = {};
        res.data.items.forEach(i => initQ[i.id] = i.quantity);
        setQuantities(initQ);
      } catch (err) {
        console.error(err);
        setError('Error cargando carrito, por favor inicia sesión.');
      }
    } else {
      // Invitado: solo IDs+qty en localStorage → enriquecemos con datos reales
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const detailed = await Promise.all(
        local.map(async i => {
          const prod = (await axios.get(`products/${i.id}/`)).data;
          return { id: i.id, product: prod, quantity: i.quantity };
        })
      );
      setCart({ items: detailed });
      const initQ = {};
      detailed.forEach(i => initQ[i.id] = i.quantity);
      setQuantities(initQ);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, isGuest]);

  // Handlers para actualizar/eliminar igual que antes...
  const handleQuantityChange = (id, amount) => {
    setQuantities(q => ({ ...q, [id]: amount }));
  };

  const handleUpdateQuantity = async (id) => {
    if (token && !isGuest) {
      try {
        await axios.patch(`cartitem/${id}/`, { quantity: quantities[id] }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Cantidad actualizada.');
        fetchCart();
      } catch {
        setMessage('Error al actualizar la cantidad.');
      }
    } else {
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const updated = local.map(item =>
        item.id === id ? { ...item, quantity: quantities[id] } : item
      );
      localStorage.setItem('localCart', JSON.stringify(updated));
      setCart({ items: updated.map(i => ({ ...i, product: { price: i.price, name: i.name, images: i.images || [] } })) });
      setMessage('Cantidad actualizada.');
    }
  };

  const handleRemoveItem = async (id) => {
    if (token && !isGuest) {
      try {
        await axios.delete(`cartitem/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Producto eliminado.');
        fetchCart();
      } catch {
        setMessage('Error al eliminar el producto.');
      }
    } else {
      const local = JSON.parse(localStorage.getItem('localCart')) || [];
      const updated = local.filter(item => item.id !== id);
      localStorage.setItem('localCart', JSON.stringify(updated));
      setCart({ items: updated.map(i => ({ ...i, product: { price: i.price, name: i.name, images: i.images || [] } })) });
      setMessage('Producto eliminado.');
    }
  };

  const handleCheckout = () => navigate('/checkout');

  return (
    <div className="container">
      <NavBar />
      <h2>Mi Carrito</h2>
      {error && <p className="cart-error">{error}</p>}
      {message && <p style={{ color: '#0f0' }}>{message}</p>}

      {!cart ? (
        <p>Cargando carrito…</p>
      ) : cart.items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.items.map(item => (
              <li key={item.id} className="cart-item">
                {item.product.images?.[0] && (
                  <img
                    src={item.product.images[0].image.startsWith('http')
                      ? item.product.images[0].image
                      : `/media/${item.product.images[0].image}`}
                    alt={item.product.name}
                    className="cart-product-image"
                  />
                )}
                <div style={{ flex: 1 }}>
                  <span className="cart-item-name">{item.product.name}</span>
                  <div className="quantity-controls">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id]}
                      onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
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
                <div className="cart-price-info">
                  <div className="price-line">
                    <span className="qty">{item.quantity}</span>
                    <span className="multiply">&times;</span>
                    <span className="unit-price">${Number(item.product.price).toFixed(0)}</span>
                  </div>
                  <div className="total-line">
                    <strong>Total:</strong> $
                    {(item.quantity * Number(item.product.price)).toFixed(0)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout} className="submit">
            Proceder al Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
