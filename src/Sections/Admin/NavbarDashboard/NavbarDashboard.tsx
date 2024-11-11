import { useContext,useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { logo_cbta } from '../../../assets/logos';
import { AuthContext } from '../../../Auto/Auth';
import './NavbarDashboard.css';

interface NavbarDashboardProps {
  setCurrentView: (view: string) => void;
}

export default function NavbarDashboard ({ setCurrentView }: NavbarDashboardProps) {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
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
    logout();
    navigate('/');
  };

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
          <a href="#" onClick={() => setCurrentView('dashboard')}>
            INICIO
          </a>
        </li>
        <li>
          <a href="#">
            TABLAS
          </a>
          <ul className="dropdown-menu-admin">
            <li><a href="#" onClick={() => setCurrentView('tblusuarios')}>USUARIOS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tblasignaturas')}>ASIGNATURAS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tbltraslados')}>TRASLADOS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tbltipotrasladotransportes')}>TRANSPORTES</a></li>
            <li><a href="#" onClick={() => setCurrentView('tblgrados')}>GRADOS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tblgrupos')}>GRUPOS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tblpreguntas')}>PREGUNTAS</a></li>
            <li><a href="#" onClick={() => setCurrentView('tblrelacionfamiliar')}>RELACIÓN FAMILIAR</a></li>
          </ul>
        </li>
        <li>
          <a href="#">DISEÑO WEB</a>
          <ul className="dropdown-menu-admin">
            <li><a href="#" onClick={() => setCurrentView('carrusel')}>CARRUSEL</a></li>
            <li><a href="#" onClick={() => setCurrentView('welcomeadmin')}>BIENVENIDA</a></li>
            <li><a href="#" onClick={() => setCurrentView('misionyvision')}>MISIÓN - VISIÓN</a></li>
            <li><a href="#" onClick={() => setCurrentView('actividadnoticias')}>NOTICIAS</a></li>
            <li><a href="#" onClick={() => setCurrentView('inscriptionadmin')}>INSCRIPCIÓN</a></li>
            <li><a href="#" onClick={() => setCurrentView('actividadcultural')}>CULTURAL</a></li>
            <li><a href="#" onClick={() => setCurrentView('carrerastecnicasadmin')}>CARRERAS TÉCNICAS</a></li>
            <li><a href="#" onClick={() => setCurrentView('sobrenosotrosadmin')}>ACERCA DE</a></li>
          </ul>
        </li>
        <li>
          <a href="#">INFORMACION</a>
          <ul className="dropdown-menu-admin">
            <li><a href="#" onClick={() => setCurrentView('infoalumn')}>ALUMNOS</a></li>
            <li><a href="#" onClick={() => setCurrentView('infodocent')}>DOCENTES</a></li>
            <li><a href="#" onClick={() => setCurrentView('infobecas')}>BECAS</a></li>
          </ul>
        </li>
        <li>
          <a href="#">CREDENCIALES</a>
          <ul className="dropdown-menu-admin">
            <li><a href="#" onClick={() => setCurrentView('createcredential')}>CREAR</a></li>
            <li><a href="#" onClick={() => setCurrentView('viewcredential')}>VISUALIZAR</a></li>
          </ul>
        </li>
        <li>
          <a href="#">HORARIOS</a>
          <ul className="dropdown-menu-admin">
            <li><a href="#" onClick={() => setCurrentView('createschedule')}>ASIGNAR</a></li>
            <li><a href="#" onClick={() => setCurrentView('viewschedule')}>VISUALIZAR</a></li>
          </ul>
        </li>
        <li>
          <a href="#" onClick={() => setCurrentView('chatadmin')}>MENSAJES</a>
        </li>
      </ul>

      <div className="navbar-admin-user">
        {user && user.foto_usuario ? (
          <>
            <img
              src={`data:image/png;base64,${user.foto_usuario}`}
              alt="Foto del usuario"
              className="navbar-admin-user-photo"
              onClick={() => setCurrentView('profiledashboardadmin')}
            />
            <span  className="user-name">{user.nombre_usuario}</span>
            <button onClick={cerrarSesion} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <span onClick={() => setCurrentView('profiledashboardadmin')} className="user-name">{user.nombre_usuario}</span>
        )}
      </div>
    </nav>
  );
}
