// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/auth/login/', { username, password })
      .then(response => {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/');
      })
      .catch(error => {
        console.error("Error en el login:", error);
        setError('Credenciales inválidas, por favor verifica tus datos.');
      });
  };

  // Función para volver a la vista anterior
  const goBack = () => {
    navigate(-1);  // Regresa a la pantalla previa
  };

  return (
    <div className="container">
      {/* Flecha para volver */}
      <div className="back-arrow" onClick={goBack}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          width="1.5em" 
          height="1.5em" 
          viewBox="0 0 16 16" 
          className="arrow-icon"
        >
          <path 
            fillRule="evenodd" 
            d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5 
               a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 
               0 1 15 8z"
          />
        </svg>
      </div>

      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="input-span">
            <label htmlFor="username" className="label">Usuario:</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-span">
            <label htmlFor="password" className="label">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="submit">Entrar</button>
        </form>
      </div>

      <div className="span">
        ¿No tienes cuenta? <a href="/register">Registrarse</a>
      </div>
    </div>
  );
}

export default Login;
