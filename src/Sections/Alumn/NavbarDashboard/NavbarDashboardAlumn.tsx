import { logo_cbta } from '../../../assets/logos'
import { useContext,useState } from 'react';
import { AuthContext } from '../../../Auto/Auth'
import { useNavigate } from 'react-router-dom'


interface NavbarDashboardAlumnProps {
  onButtonClick: (section: string) => void
}

const NavbarDashboardAlumn: React.FC<NavbarDashboardAlumnProps> = ({
  onButtonClick,
}) => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <a href="#" onClick={() => onButtonClick('dashboardalumn')}>
            INICIO
          </a>
        </li>
        <li>
          <a href="#">INFORMACIÓN</a>
          <ul className="dropdown-menu-admin">
            <li>
          
            </li>
            <li>
              <a href="#" onClick={() => onButtonClick('escolar')}>
                ESCOLAR
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">CREDENCIAL</a>
          <ul className="dropdown-menu-admin">
            <li>
              <a href="#" onClick={() => onButtonClick('credencialalumno')}>
                VIRTUAL
              </a>
            </li>
            <li>
              <a href="#" onClick={() => onButtonClick('solicitarcredencialalumno')}>
                SOLICITAR
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" onClick={() => onButtonClick('HorarioEscolarAlumnoPropio')}>
            HORARIOS
          </a>
        </li>
        <li>
          <a href="#" onClick={() => onButtonClick('NotificationAlumn')}>
            MENSAJES
          </a>
        </li>
      </ul>

      <div className="navbar-admin-user">
        {user && user.foto_usuario ? (
          <>
            <img
              src={`data:image/png;base64,${user.foto_usuario}`}
              alt="Foto del usuario"
              className="navbar-admin-user-photo"
              onClick={() => onButtonClick('profiledashboardalumn')}
            />
            <span className="user-name">{user.nombre_usuario}</span>
            <button onClick={cerrarSesion} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <span className="user-name">{user.nombre_usuario}</span>
        )}
      </div>
    </nav>
  )
}

export default NavbarDashboardAlumn
