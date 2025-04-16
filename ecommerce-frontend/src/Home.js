// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import styled from 'styled-components'
import './HeroAnimation.css';


function Home() {
  return (
    <>
      <button className="button" data-text="CodeStore">
      <span className="actual-text">&nbsp;CodeStore&nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;CodeStore&nbsp;</span>
      </button>

      {/* Sección hero */}
      <section className="home-hero">
      {/* Contenedor para colocar el botón Iniciar Sesión arriba a la derecha */}
      <div className="hero-header">
        <Link to="/login" className="login-btn">Iniciar Sesión</Link>
      </div>

      <h1>¡Bienvenido a CodeStore!</h1>
      <p>Explora nuestros productos y descubre ofertas increíbles.</p>

      <div className="home-hero-buttons">
        <Link to="/products" className="cta-button">Ver Productos</Link>
      </div>
    </section>
    </>
  );
}

export default Home;
