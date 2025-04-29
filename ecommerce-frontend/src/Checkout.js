// src/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Checkout.css';
import axios from 'axios';
import { trackFacebookEvent } from './FacebookPixel';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Checkout() {
  const [formData, setFormData] = useState({
    addressLine1: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token     = localStorage.getItem('accessToken');
  const isGuest   = localStorage.getItem('isGuest') === 'true';
  const csrftoken = getCookie('csrftoken');

  const handleChange = e => {
    setFormData(fd => ({ ...fd, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      // 0) Si eres invitado, "sube" tu localCart al servidor
      if (isGuest) {
        const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
        for (let entry of localCart) {
          await axios.post(
            'add-to-cart/',
            { product_id: entry.id, quantity: entry.quantity },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              }
            }
          );
        }
      }

      // 1) Crear la orden (invitado o autenticado)
      const ordRes = await axios.post(
        'orders/',
        formData,
        isGuest
          ? {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              }
            }
          : {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              }
            }
      );

      const total = Number(ordRes.data.total_price);
      if (total <= 0) {
        throw new Error('El total de la orden es 0. Verifica tu carrito.');
      }

      // 2) Generar preferencia de pago
      const prefRes = await axios.post(
        'create-payment-preference/',
        { total },
        isGuest
          ? {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              }
            }
          : {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              }
            }
      );

      // 3) Si fuiste invitado, limpia localStorage
      if (isGuest) {
        localStorage.removeItem('localCart');
        localStorage.removeItem('isGuest');
      }
      trackFacebookEvent('Purchase', {
               currency: 'CLP',
               value: total + shipping  // total ya lo calculaste antes (subtotal + envío)
             });

      // 4) Redirige a Mercado Pago
      window.location.href = prefRes.data.init_point;

    } catch (err) {
      console.error('Error en el checkout:', err.response || err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Error procesando el checkout. Verifica los datos.'
      );
    }
  };

  return (
    <div className="container checkout-container">
      <NavBar />
      <h2>Checkout</h2>
      {error && <p className="cart-error">{error}</p>}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="input-span">
            <label htmlFor="addressLine1" className="label">Dirección:</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-span">
            <label htmlFor="city" className="label">Ciudad:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-span">
            <label htmlFor="postalCode" className="label">Código Postal:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-span">
            <label htmlFor="country" className="label">País:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-span">
            <label htmlFor="phoneNumber" className="label">Teléfono:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Ej: +56 9 1234 5678"
              required
            />
          </div>

          <button type="submit" className="submit">
            Finalizar Compra
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="secondary-btn"
          >
            Volver al Carrito
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
