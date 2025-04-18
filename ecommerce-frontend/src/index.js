// src/index.js
import axios from 'axios';

// Apunta al endpoint de autenticación
axios.defaults.baseURL = 'https://api.codestorebl.com/api/auth/';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App/></React.StrictMode>);
reportWebVitals();
