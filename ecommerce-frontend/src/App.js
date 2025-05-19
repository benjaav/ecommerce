import React from 'react';
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
