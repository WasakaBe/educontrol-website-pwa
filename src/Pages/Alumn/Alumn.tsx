import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auto/Auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
  HorarioEscolarAlumnoPropio,
  NotificationAlumn,
} from '../../Sections/Alumn'
import {
  AlumnDashboard,
  CredentialsAlumn,
  Escolar,
  NavbarDashboardAlumn,
  ProfileAlumnDashboard,
  SolicitarCredencialAlumno,
} from '../../Sections/Alumn'

const Alumn: React.FC = () => {
  const [currentPanel, setCurrentPanel] = useState<string>('dashboardalumn')
  const { isAuthenticated, user } = useContext(AuthContext) || {
    isAuthenticated: false,
    user: null,
  }
  const navigate = useNavigate()

  const handleButtonClick = (panel: string) => {
    setCurrentPanel(panel)
  }


  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene el rol de alumno
    if (!isAuthenticated || user?.idRol !== 2) {
      navigate('/')
      toast.error('No tienes permisos de alumno.')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="admin-container-pages">
      <NavbarDashboardAlumn onButtonClick={handleButtonClick} />
      {currentPanel === 'dashboardalumn' && <AlumnDashboard />}
      {currentPanel === 'profiledashboardalumn' && <ProfileAlumnDashboard />}
      {currentPanel === 'escolar' && <Escolar />}
      {currentPanel === 'credencialalumno' && <CredentialsAlumn />}
      {currentPanel === 'solicitarcredencialalumno' && (
        <SolicitarCredencialAlumno />
      )}
      {currentPanel === 'HorarioEscolarAlumnoPropio' && user && (
        <HorarioEscolarAlumnoPropio
        />
      )}
      {currentPanel === 'NotificationAlumn' && <NotificationAlumn />}
    </div>
  )
}

export default Alumn
