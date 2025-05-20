import React, { useState, useEffect } from 'react';
import { trackFacebookEvent } from './FacebookPixel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token   = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // Limpia localStorage de carrito y tokens antiguos
  const clearLocalStorage = () => {
    localStorage.removeItem('localCart');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isGuest');
    setMessage('Datos antiguos limpiados. Por favor, recarga la página.');
  };

  // Carga el carrito: API si auth, localStorage + fetch productos si invitado
  const fetchCart = async () => {
    try {
      if (token && !isGuest) {
        const res = await axios.get('cart/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setCart(res.data);
        const initQ = {};
        res.data.items.forEach(i => initQ[i.id] = i.quantity);
        setQuantities(initQ);
      } else {
        const local = JSON.parse(localStorage.getItem('localCart')) || [];
        const detailed = await Promise.all(
          local.map(async entry => {
            const prod = (await axios.get(`products/${entry.id}/`)).data;
            return {
              id: entry.id,
              product: prod,
              quantity: entry.quantity
            };
          })
        );
        setCart({ items: detailed });
        const initQ = {};
        detailed.forEach(i => initQ[i.id] = i.quantity);
        setQuantities(initQ);
      }
    } catch (err) {
      console.error(err);
      setError('Error cargando carrito.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, isGuest]);

  const handleQuantityChange = (itemId, newQty) => {
    setQuantities(q => ({ ...q, [itemId]: newQty }));
  };

  const handleUpdateQuantity = async (itemId) => {
    if (token && !isGuest) {
      try {
        await axios.patch(
          `cartitem/${itemId}/`,
          { quantity: quantities[itemId] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Cantidad actualizada.');
        fetchCart();
      } catch {
        setMessage('Error al actualizar la cantidad.');
      }
    } else {
      const updatedItems = cart.items.map(item => (
        item.id === itemId
          ? { ...item, quantity: quantities[itemId] }
          : item
      ));
      setCart({ items: updatedItems });
      const toStore = updatedItems.map(i => ({ id: i.id, quantity: i.quantity }));
      localStorage.setItem('localCart', JSON.stringify(toStore));
      setMessage('Cantidad actualizada.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (token && !isGuest) {
      try {
        await axios.delete(`cartitem/${itemId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Producto eliminado.');
        fetchCart();
      } catch {
        setMessage('Error al eliminar el producto.');
      }
    } else {
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      setCart({ items: updatedItems });
      const toStore = updatedItems.map(i => ({ id: i.id, quantity: i.quantity }));
      localStorage.setItem('localCart', JSON.stringify(toStore));
      setMessage('Producto eliminado.');
    }
  };

  const handleCheckout = () => {
    trackFacebookEvent('InitiateCheckout', {
      value: total,
      currency: 'CLP'
    });
    navigate('/checkout');
  };

  if (!cart) return <p className="cart-error">Cargando carrito…</p>;

  // Cálculo subtotal y total con envío
  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.quantity * Number(i.product.price), 0
  );
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <NavBar />
      <h2>Mi Carrito</h2>
      {error && <p className="cart-error">{error}</p>}
      {message && <p className="cart-message">{message}</p>}

      <button onClick={clearLocalStorage} className="clear-storage-btn">
        Limpiar datos antiguos
      </button>

      {cart.items.length === 0 ? (
        <p className="empty-cart-message">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.items.map(item => (
              <li key={item.id} className="cart-item">
                {item.product.images?.[0] && (
                  <img
                    src={
                      item.product.images[0].image.startsWith('http')
                        ? item.product.images[0].image
                        : `/media/${item.product.images[0].image}`
                    }
                    alt={item.product.name}
                    className="cart-product-image"
                  />
                )}
                <div>
                  <span className="cart-item-name">{item.product.name}</span>
                  <div className="quantity-controls">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id]}
                      onChange={e =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      className="quantity-input"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id)}
                      className="update-btn"
                    >Actualizar</button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >Eliminar</button>
                  </div>
                </div>
                <div className="cart-price-info">
                  <div className="price-line">
                    <span className="qty">{item.quantity}</span>
                    <span className="multiply">&times;</span>
                    <span className="unit-price">
                      ${Number(item.product.price).toFixed(0)}
                    </span>
                  </div>
                  <div className="total-line">
                    <strong>Total:</strong> $
                    {(item.quantity * Number(item.product.price)).toFixed(0)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>Subtotal: <strong>${subtotal.toLocaleString()}</strong></p>
            <p>Envío: <strong>${shipping.toLocaleString()}</strong></p>
            <p>Total: <strong>${total.toLocaleString()}</strong></p>
          </div>

          <button onClick={handleCheckout} className="checkout-btn">
            Proceder al Checkout
          </button>
        </>
      )}
    </div>
  );
};