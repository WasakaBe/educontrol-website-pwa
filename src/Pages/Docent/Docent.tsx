import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auto/Auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
  CredentialsDocent,
  DashboardDocent,
  HorarioDocente,
  NavbarDashboardDocent,
  ProfileDocentDashboard,
} from '../../Sections/Docent'
const Admin: React.FC = () => {
  const [currentPanel, setCurrentPanel] = useState<string>('dashboarddocente')
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error(
      'useContext(AuthContext) must be used within an AuthContextProvider'
    )
  }

  const { isAuthenticated, user } = authContext
  const navigate = useNavigate()

  const handleButtonClick = (panel: string) => {
    setCurrentPanel(panel)
  }

  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene el rol de administrador
    if (!isAuthenticated || user?.idRol !== 3) {
      navigate('/')
      toast.error('No tienes permisos de Docente.')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="admin-container-pages">
      <NavbarDashboardDocent onButtonClick={handleButtonClick} />
      {currentPanel === 'dashboarddocente' && <DashboardDocent />}
      {currentPanel === 'profiledashboarddocent' && <ProfileDocentDashboard />}
      {currentPanel === 'credencialdocente' && <CredentialsDocent />}
      {currentPanel === 'horariodocente' && <HorarioDocente />}
    </div>
  )
}

export default Admin
