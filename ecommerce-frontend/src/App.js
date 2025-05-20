import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Login from './Login';
import Register from './Register';
import Cart from './Cart';
import Checkout from './Checkout';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import { trackFacebookEvent } from './FacebookPixel';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito desde localStorage o iniciar vacío
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Guardar carrito en localStorage al cambiar
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const onUpdateQuantity = (id, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const onRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Productos accesibles sin login */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Carrito y checkout accesibles sin login */}
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          }
        />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
