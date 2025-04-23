// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Products from './Products';
import ProductDetail from './ProductDetail'; // <-- importar el nuevo componente
import Login from './Login';
import Register from './Register';
import Cart from './Cart';
import Checkout from './Checkout';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/cart" element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  } />
  <Route path="/checkout" element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  } />
</Routes>
    </Router>
  );
}

export default App;
