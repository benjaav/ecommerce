import React, { useEffect, useState, useRef } from 'react';
import { trackFacebookEvent } from './FacebookPixel';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import './Products.css';

// Configurar URL base de axios para apuntar a la API backend
axios.defaults.baseURL = 'https://api.codestorebl.com/api/';

function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-text title" />
      <div className="skeleton-text price" />
      <div className="skeleton-button" />
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // Refs to track progress timing and bytes loaded
  const startTimeRef = useRef(null);
  const lastLoadedRef = useRef(0);

  const fetchProducts = (page = 1) => {
    setLoading(true);
    setLoadingProgress(0);
    setRemainingTime(null);
    startTimeRef.current = null;
    lastLoadedRef.current = 0;

    axios.get(`products/?page=${page}`, {
      onDownloadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          const now = Date.now();
          if (!startTimeRef.current) {
            startTimeRef.current = now;
            lastLoadedRef.current = progressEvent.loaded;
          } else {
            const elapsed = (now - startTimeRef.current) / 1000; // seconds
            const totalLoaded = progressEvent.loaded;
            const total = progressEvent.total;
            const speed = totalLoaded / elapsed; // bytes per second
            const remainingBytes = total - totalLoaded;
            const estimatedRemainingTime = remainingBytes / speed; // seconds

            setRemainingTime(Math.max(0, Math.round(estimatedRemainingTime)));
          }

          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLoadingProgress(percentCompleted);
        }
      }
    })
      .then(response => {
        const data = response.data;
        if (data.results) {
          if (page === 1) {
            setProducts(data.results);
          } else {
            setProducts(prevProducts => [...prevProducts, ...data.results]);
          }
          setTotalPages(Math.ceil(data.count / 10)); // assuming page_size=10
          setCurrentPage(page);
        } else {
          if (page === 1) {
            setProducts(data);
          } else {
            setProducts(prevProducts => [...prevProducts, ...data]);
          }
          setTotalPages(1);
          setCurrentPage(page);
        }
        setLoadingProgress(100);
        setRemainingTime(0);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setLoadingProgress(100);
        setRemainingTime(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();

    // Solo rastrear evento Pixel en acciones iniciadas por el usuario
    if (!token) {
      let localCart = JSON.parse(localStorage.getItem('localCart')) || [];
      const existingItem = localCart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const product = products.find(p => p.id === productId);
        localCart.push({
          id: productId,
          quantity: 1,
          name: product ? product.name : '',
          price: product ? product.price : 0,
          images: product ? product.images : []
        });
      }
      localStorage.setItem('localCart', JSON.stringify(localCart));
      setSuccessMessage(productId);
      trackFacebookEvent('AddToCart', {
        content_ids: [productId],
        content_type: 'product',
        value: products.find(p => p.id === productId)?.price || 0,
        currency: 'CLP'
      });
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    axios.post('add-to-cart/', { product_id: productId, quantity: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setSuccessMessage(productId);
        setTimeout(() => setSuccessMessage(null), 3000);
        // Evento Pixel solo en acción usuario
        trackFacebookEvent('AddToCart', {
          content_ids: [productId],
          content_type: 'product',
          value: products.find(p => p.id === productId)?.price || 0,
          currency: 'CLP'
        });
      })
      .catch(error => {
        console.error("Error agregando al carrito:", error);
      });
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchProducts(currentPage + 1);
    }
  };

  return (
    <div className="products-page-container">
      <NavBar />
      <h2 className="header">Lista de Productos</h2>

      {loadingProgress < 100 && (
        <div className="loading-progress">
          Cargando productos... {loadingProgress}%
          {remainingTime !== null && remainingTime > 0 && (
            <span> - Tiempo restante: {remainingTime} segundos</span>
          )}
        </div>
      )}

      <div className="product-grid" style={{ opacity: loadingProgress < 100 ? 0.5 : 1 }}>
        {loading && currentPage === 1 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          products.slice().reverse().map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].image}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
              )}
              <h3>{product.name}</h3>
              <p className="price">${parseInt(product.price)}</p>

              <button
                className="add-to-cart-btn"
                onClick={(e) => handleAddToCart(e, product.id)}
              >
                Agregar al Carrito
              </button>

              {successMessage === product.id && (
                <p className="success-message">¡Producto agregado con éxito!</p>
              )}
            </div>
          ))
        )}
      </div>

      {currentPage < totalPages && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Cargar más
          </button>
        </div>
      )}

      {loading && currentPage > 1 && (
        <div className="loading-more">Cargando más productos...</div>
      )}
    </div>
  );
}

export default Products;