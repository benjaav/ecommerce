import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './HeroAnimation.css';

function Home() {
  return (
    <>
      {/* Logo animado */}
      <button className="button" data-text="CodeStore">
        <span className="actual-text">&nbsp;CodeStore&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;CodeStore&nbsp;</span>
      </button>

      {/* Hero */}
      <section className="home-hero">
        <h1>¡Bienvenido a CodeStore!</h1>
        <p>Explora nuestros productos y descubre ofertas increíbles.</p>

        {/* Botones centrados debajo del texto */}
        <div className="hero-btns">
          <Link to="/login" className="hero-btn">Ingresar</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
