import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './HeroAnimation.css';

function Home() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', 'true');
    navigate('/products');
  };

  return (
    <>
  

      {/* Hero */}
      <section className="home-hero">
        <h1>¡Bienvenido a CodeStore!</h1>
        <p>Explora nuestros productos y descubre ofertas increíbles.</p>

        {/* Botón centrado debajo del texto */}
        <div className="hero-btns">
          <button onClick={handleGuestLogin} className="hero-btn">Ingresar</button>
        </div>
      </section>
    </>
  );
}

export default Home;
