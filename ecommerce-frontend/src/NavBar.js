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
          // Token inválido o expirado, forzar logout
          localStorage.removeItem('accessToken');
          setUsername(null);
          navigate('/login');
        }
      });
    } else {
      setUsername(null);
    }
  }, [token, navigate]);

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

        {!username && (
          <Link to="/login" className="link-btn">
            <button className="button">
              <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
              </svg>
              <span className="btn-text">Login</span>
            </button>
          </Link>
        )}

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
    background: rgba(0, 0, 0, 0.6);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }

  .button {
    width: 80px;
    height: 70px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--clr-light);
    border-radius: 10px;
    margin: 0 8px;
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
    font-size: 0.7rem;
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
`;

export default NavBar;
