import React,{ useContext,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logo_cbta } from '../../../assets/logos'
import { AuthContext } from '../../../Auto/Auth'


interface NavbarDashboardProps {
  onButtonClick: (view: string) => void
}

const NavbarDashboardDocent: React.FC<NavbarDashboardProps> = ({
  onButtonClick,
}) => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (isMenuOpen === undefined) {
    setIsMenuOpen(false);
  }
  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  
  // Verifica que el contexto y el usuario estén disponibles
  if (!authContext || !authContext.user) {
    return null; // O muestra algún componente de carga o estado de "no logueado"
  }

  const { logout, user } = authContext;
  const cerrarSesion = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar-admin">
      <div className="navbar-logo">
        <img src={logo_cbta} alt="CRM Logo" className="logo-admin" />
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`navbar-admin-menu ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <a href="#" onClick={() => onButtonClick('dashboarddocente')}>
            INICIO
          </a>
        </li>
        <li>
          <a href="#">CREDENCIALES ESCOLARES</a>
          <ul className="dropdown-menu-admin">
            <li>
              <a href="#" onClick={() => onButtonClick('credencialdocente')}>
                VISUALIZAR
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">HORARIOS ESCOLARES</a>
          <ul className="dropdown-menu-admin">
            <li>
              <a href="#" onClick={() => onButtonClick('horariodocente')}>
                VISUALIZAR
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="navbar-admin-user">
        {user && user.foto_usuario ? (
          <>
            <img
              src={`data:image/png;base64,${user.foto_usuario}`}
              alt="Foto del usuario"
              className="navbar-admin-user-photo"
              onClick={() => onButtonClick('profiledashboarddocent')}
            />
            <span className="user-name">{user.nombre_usuario}</span>
            <button onClick={cerrarSesion} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <span    onClick={() => onButtonClick('profiledashboarddocent')} className="user-name">{user.nombre_usuario}</span>
        )}
      </div>
    </nav>
  )
}

export default NavbarDashboardDocent
