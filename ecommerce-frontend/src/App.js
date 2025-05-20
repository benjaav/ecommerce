import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import { trackFacebookEvent } from './FacebookPixel';

function App() {
  const [cartItems, setCartItems] = React.useState([]);

  // Cargar carrito inicial desde backend
  React.useEffect(() => {
    axios.get('/cart/')
      .then(response => {
        const cart = response.data;
        if (cart && cart.items) {
          setCartItems(cart.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0].image : '',
          })));
        }
      })
      .catch(error => {
        console.error('Error cargando carrito:', error);
      });
  }, []);

  const addToCart = (product, quantity = 1) => {
    axios.post('/add-to-cart/', {
      product_id: product.id,
      quantity: quantity,
    })
    .then(response => {
      if (response.data && response.data.cart_item) {
        // Actualizar estado cartItems con la cantidad actualizada
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          if (existingItem) {
            return prevItems.map(item =>
              item.id === product.id ? { ...item, quantity: response.data.cart_item.quantity } : item
            );
          } else {
            return [...prevItems, { ...product, quantity: response.data.cart_item.quantity, image: product.images && product.images.length > 0 ? product.images[0].image : '' }];
          }
        });
      }
    })
    .catch(error => {
      console.error('Error agregando al carrito:', error);
    });
  };

  const onUpdateQuantity = (id, quantity) => {
    // Aquí se podría agregar llamada a backend para actualizar cantidad si se desea
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const onRemoveItem = (id) => {
    // Aquí se podría agregar llamada a backend para eliminar item si se desea
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={
            <Products
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductDetail
              addToCart={addToCart}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
