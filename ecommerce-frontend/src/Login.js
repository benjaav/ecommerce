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
    axios.post('auth/login/', { username, password })
      .then(response => {
        // Limpio flag de invitado si existía
        localStorage.removeItem('isGuest');
        // Guardo tokens y continuo sesión normal
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/');
      })
      .catch(error => {
        console.error("Error en el login:", error);
        setError('Credenciales inválidas, por favor verifica tus datos.');
      });
  };

  const continueAsGuest = () => {
    // Marco como invitado
    localStorage.setItem('isGuest', 'true');
    // Borro tokens si existían
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/cart');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="back-arrow" onClick={goBack}>
        {/* ícono SVG */}
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
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-span">
            <label htmlFor="password" className="label">Contraseña:</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit">Entrar</button>
        </form>
      </div>

      <div className="span">
        <button onClick={continueAsGuest}>
          Continuar como invitado
        </button>
        ¿No tienes cuenta? <a href="/register">Registrarse</a>
      </div>
    </div>
  );
}

export default Login;
