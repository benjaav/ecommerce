// src/FloatingCartButton.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FloatingButton = styled(Link)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #00ffcc;
  color: #000;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px #00ffcc;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00cc99;
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

function FloatingCartButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
      setShow(localCart.length > 0);
    };

    checkCart();

    window.addEventListener('storage', checkCart);
    return () => window.removeEventListener('storage', checkCart);
  }, []);

  if (!show) return null;

  return (
    <FloatingButton to="/cart" aria-label="Ir al carrito">
      <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </FloatingButton>
  );
}

export default FloatingCartButton;
