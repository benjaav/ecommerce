// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configuramos el baseURL de Axios para que todas las peticiones vayan a nuestra API
axios.defaults.baseURL = 'https://api.codestorebl.com';
// Si aún no tienes tu subdominio apuntando, podrías usar:
// axios.defaults.baseURL = 'https://ecommerce-idm5.onrender.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
