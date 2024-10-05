import React, { useState } from 'react';
import './Navbar.css';
import { logo_cbta } from '../../../assets/logos';
import { Login } from '../../../forms';
import { BecasModal, ReinscriptionModal } from '../../../components';

const Navbar: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showBecas, setShowBecas] = useState(false);
  const [showReinscription, setShowReinscription] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleBecasClick = () => {
    setShowBecas(true);
  };

  const handleCloseBecas = () => {
    setShowBecas(false);
  };

  const handleReinscriptionClick = () => {
    setShowReinscription(true);
  };

  const handleCloseReinscription = () => {
    setShowReinscription(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="navbar-logo">
            <img src={logo_cbta} alt="Logo" className="navbar-logo-img" />
            <span>EduControl</span>
          </a>
          <button className="navbar-toggler" onClick={toggleMenu}>
            ☰
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="navbar-item"><a href="/">Inicio</a></li>
            <li className="navbar-item"><a href="/#Acerca">Acerca</a></li>
            <li className="navbar-item dropdown">
              <a href="#" className="dropdown-toggle">Servicios</a>
              <ul className="dropdown-menu">
                <li className="dropdown-item"><a href="/#Inscripcion">Inscripción</a></li>
                <li className="dropdown-item"><a href="#" onClick={handleReinscriptionClick}>Reinscripción</a></li>
                <li className="dropdown-item dropdown-submenu">
                  <a href="#">Escolares</a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item"><a href="#" onClick={handleBecasClick}>Becas</a></li>
                    <li className="dropdown-item"><a href="/#">Titulación</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="navbar-item"><a href="/#Contact">Contacto</a></li>
            <li className="navbar-item">
              <a href="#" onClick={handleLoginClick}>Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </nav>
      {showLogin && <Login onClose={handleCloseLogin} />}
      {showBecas && <BecasModal onClose={handleCloseBecas} />}
      {showReinscription && <ReinscriptionModal onClose={handleCloseReinscription} />}
    </>
  );
};

export default Navbar;
