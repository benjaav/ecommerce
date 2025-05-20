import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import SkeletonCard from './SkeletonCard';
import ProductCard from './ProductCard';
import { trackFacebookEvent } from './FacebookPixel';
import './Products.css';

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

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
            const elapsed = (now - startTimeRef.current) / 1000;
            const totalLoaded = progressEvent.loaded;
            const total = progressEvent.total;
            const speed = totalLoaded / elapsed;
            const remainingBytes = total - totalLoaded;
            const estimatedRemainingTime = remainingBytes / speed;

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
          setTotalPages(Math.ceil(data.count / 10));
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

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchProducts(currentPage + 1);
    }
  };

  return (
    <div className="container">
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
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
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