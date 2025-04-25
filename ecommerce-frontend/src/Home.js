import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <button className="button" data-text="CodeStore">
        <span className="actual-text">&nbsp;CodeStore&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;CodeStore&nbsp;</span>
      </button>

      <section className="home-hero">
        <div className="hero-header">
          <Link to="/login" className="login-btn">Iniciar Sesión</Link>
          <button onClick={handleGuestLogin} className="guest-btn">Ingresar como invitado</button>
        </div>

        <h1>¡Bienvenido a CodeStore!</h1>
        <p>Explora nuestros productos y descubre ofertas increíbles.</p>
        {/* El CTA "Ver Productos" está oculto vía CSS */}
      </section>
    </>
  );
}

export default Home;
