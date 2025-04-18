import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// apuntas a https://api.codestorebl.com/api/
// dejamos la base apuntando al prefijo /api/
axios.defaults.baseURL = 'https://api.codestorebl.com/api/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
