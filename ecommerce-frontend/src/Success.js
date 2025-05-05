import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackFacebookEvent } from './FacebookPixel';

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params or state for order info if available
  // For example, orderId, total, currency, etc.
  // Here we assume total and currency are passed as query params for demo
  const query = new URLSearchParams(location.search);
  const total = query.get('total') || 0;
  const currency = query.get('currency') || 'CLP';

  useEffect(() => {
    // Trigger Meta Pixel Purchase event
    trackFacebookEvent('Purchase', {
      value: parseFloat(total),
      currency: currency,
    });
  }, [total, currency]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="success-page">
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu pago fue procesado exitosamente.</p>
      <button onClick={handleGoHome}>Volver al inicio</button>
    </div>
  );
}

export default Success;
