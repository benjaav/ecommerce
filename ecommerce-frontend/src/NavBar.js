// src/NavBar.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavBar() {
  const [username, setUsername] = useState(null);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.get('user/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error("Error obteniendo usuario:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          setUsername(null);
        }
      });
    } else {
      setUsername(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUsername(null);
    navigate('/login');
  };

  return (
    <StyledWrapper>
      <div className="button-container">
        <Link to="/" className="link-btn">
          <button className="button">
            <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
              <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2z" />
            </svg>
            <span className="btn-text">Menú</span>
          </button>
        </Link>

        <Link to="/products" className="link-btn">
          <button className="button">
            <svg width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
              <path d="M6 2L3 6v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="btn-text">Productos</span>
          </button>
        </Link>

        <Link to="/cart" className="link-btn">
          <button className="button">
            <svg width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="btn-text">Carrito</span>
          </button>
        </Link>

        {/* Botón WhatsApp */}
        <a
          href="https://wa.me/56992036338"
          target="_blank"
          rel="noopener noreferrer"
          className="link-btn"
        >
          <button className="button" aria-label="WhatsApp">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.91 11.91 0 0 0 12 0C5.37 0 0 5.37 0 12a11.91 11.91 0 0 0 3.48 8.52l-1.5 5.52 5.52-1.5A11.91 11.91 0 0 0 12 24c6.63 0 12-5.37 12-12a11.91 11.91 0 0 0-3.48-8.52Zm-8.52 16.5a8.25 8.25 0 0 1-4.5-1.35l-.3-.18-3 1 1-3-.18-.3a8.25 8.25 0 0 1-1.35-4.5 8.25 8.25 0 0 1 15 0 8.25 8.25 0 0 1-8.25 8.25Zm4.5-5.25c-.15 0-.3 0-.45-.15l-1.35-1.35a.3.3 0 0 1 0-.45l.15-.15a.3.3 0 0 1 .45 0l1.35 1.35c.15.15.15.3 0 .45l-.15.15Zm-2.25-3.75a.75.75 0 0 1 0-1.5h.15a.75.75 0 0 1 0 1.5h-.15Z" />
            </svg>
            <span className="btn-text">WhatsApp</span>
          </button>
        </a>

        {/* Botón Instagram */}
        <a
          href="https://www.instagram.com/codestorebl/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-btn"
        >
          <button className="button" aria-label="Instagram">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 3.25a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm4.75-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
            </svg>
            <span className="btn-text">Instagram</span>
          </button>
        </a>

        {username && (
          <>
            <div className="user-welcome">
              Hola, <strong>{username}</strong>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    gap: 10px;
  }

  .button {
    width: 60px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--clr-light);
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 5px var(--primary-color);
  }

  .btn-text {
    font-size: 0.6rem;
    color: #fff;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .user-welcome {
    color: #00ffcc;
    font-weight: 600;
    margin-left: 15px;
    font-size: 0.9rem;
  }

  .logout-btn {
    margin-left: 15px;
    padding: 6px 12px;
    background-color: #ff4d4d;
    border: none;
    color: #fff;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
  }

  .logout-btn:hover {
    background-color: #e60000;
  }

  .link-btn {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    z-index: 10000 !important;

    .button-container {
      flex-direction: row;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-height: 60px;
      transform: none;
      padding: 10px 0;
      overflow-x: auto;
      overflow-y: hidden;
      justify-content: space-around;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0;
      z-index: 10000;
      pointer-events: auto;
    }

    .button {
      width: 50px;
      height: 50px;
      margin: 0;
    }
  }

  @media (max-width: 480px) {
    .button {
      width: 45px;
      height: 45px;
      margin: 0 4px;
    }
    .btn-text {
      font-size: 0.5rem;
    }
  }
`;


export default NavBar;