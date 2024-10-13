import React, { useEffect, useState } from 'react';
import './plashScreen.css';
import { logo_cbta } from './assets/logos';

const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simula la pantalla de introducción durante 3 segundos
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <div className="splash-screen">
          <div className="splash-logo-container">
            <div className="glow-circle">
              <img src={logo_cbta} alt="EduControl Logo" className="splash-logo" />
            </div>
          </div>
          <h1 className="splash-title">Bienvenido a EduControl</h1>
        </div>
      ) : null}
    </>
  );
};

export default SplashScreen;
