// src/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Checkout.css';
import axios from 'axios';

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

  const token   = localStorage.getItem('accessToken');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1) Crear la orden (anónimo o autenticado)
      const orderResponse = await axios.post(
        'orders/',
        formData,
        isGuest
          ? {}  // invitados no envían cabeceras JWT
          : { headers: { Authorization: `Bearer ${token}` } }
      );

      const total = Number(orderResponse.data.total_price);
      if (total <= 0) {
        throw new Error('El total de la orden es 0. Verifica tu carrito.');
      }

      // 2) Generar preferencia de pago
      const prefResponse = await axios.post(
        'create-payment-preference/',
        { total },
        isGuest
          ? { headers: { 'Content-Type': 'application/json' } }
          : { headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            } }
      );

      // 3) Si fue invitado, limpiar carrito local y flag
      if (isGuest) {
        localStorage.removeItem('localCart');
        localStorage.removeItem('isGuest');
      }

      // 4) Redirigir a Mercado Pago
      window.location.href = prefResponse.data.init_point;

    } catch (err) {
      console.error('Error en el checkout:', err.response || err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Error procesando el checkout. Por favor, verifica los datos.'
      );
    }
  };

  const goBackToCart = () => {
    navigate('/cart');
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
            onClick={goBackToCart}
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
