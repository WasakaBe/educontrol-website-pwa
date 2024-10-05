import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auto/Auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FamiliarDashboard, InfoAlumnoFamiliar, NavbarDashboardFamily, PerfilFamiliar } from '../../Sections/Family'

const Family: React.FC = () => {
  const [currentPanel, setCurrentPanel] = useState<string>('dashboardfamiliar')
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
    if (!isAuthenticated || user?.idRol !== 4) {
      navigate('/')
      toast.error('No tienes permisos de Familiar.')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="admin-container-pages">
      <NavbarDashboardFamily onButtonClick={handleButtonClick} />
      {currentPanel === 'dashboardfamiliar' && <FamiliarDashboard />}
      {currentPanel === 'perfilfamiliar' && <PerfilFamiliar />}
      {currentPanel === 'infoalumnofamiliar' && <InfoAlumnoFamiliar />}
    </div>
  )
}

export default Family
