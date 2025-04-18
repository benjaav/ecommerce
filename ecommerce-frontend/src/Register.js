// src/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    axios.post('/api/auth/register/', formData)
      .then((response) => {
        console.log('Registro exitoso:', response.data);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error al registrar:', err);
        if (err.response && err.response.data) {
          setError(JSON.stringify(err.response.data));
        } else {
          setError('Error al registrar el usuario.');
        }
      });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Registro de Usuario</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="input-span">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-span">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-span">
            <label htmlFor="first_name">Nombre:</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="input-span">
            <label htmlFor="last_name">Apellido:</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="input-span">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-span">
            <label htmlFor="password2">Confirmar Contraseña:</label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit">
            Registrarse
          </button>
        </form>
      </div>
      <div className="span">
        <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        <p><Link to="/">Volver al Inicio</Link></p>
      </div>
    </div>
);

}

export default Register;
