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
  const token = localStorage.getItem('accessToken');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Paso 1: Crear la orden pendiente
    axios.post('auth/orders/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(orderResponse => {
        console.log("Orden creada:", orderResponse.data);
        const total = Number(orderResponse.data.total_price);
        if (total <= 0) {
          throw new Error("El total de la orden es 0. Verifica tu carrito.");
        }
        // Paso 2: Solicitar la preferencia de pago usando el total
        return axios.post('create-payment-preference/', 
          { total: total },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
      })
      .then(preferenceResponse => {
        console.log("Preferencia generada:", preferenceResponse.data);
        // Redirige al usuario a la URL de pago
        window.location.href = preferenceResponse.data.init_point;
      })
      .catch(err => {
        console.error("Error en el checkout:", err.response || err);
        setError(err.response?.data?.error || "Error procesando el checkout. Por favor, verifica la información.");
      });
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
          <button type="button" onClick={goBackToCart} className="secondary-btn">
            Volver al Carrito
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
