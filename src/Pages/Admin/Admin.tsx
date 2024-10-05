import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auto/Auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import {
  ActividadCulturalAdmin,
  ActividadNoticias,
  AdminDashboard,
  CarrerasTecnicasAdmin,
  Carrusel,
  ChatAdmin,
  CredentialsCreate,
  CredentialsView,
  InfoAlumn,
  InfoBecas,
  InfoDocent,
  InscriptionAdmin,
  MisionVision,
  NavbarDashboard,
  ProfileAdminDashboard,
  SchedulesCreate,
  SchedulesView,
  SobreNosotros,
  WelcomeAdmin,
} from '../../Sections/Admin'
import {
  TblAsignaturas,
  TblGrados,
  TblGrupos,
  TblPreguntas,
  TblRelacionFamiliar,
  TblTipoTraslados,
  TblTipoUsuarios,
  TblTraslados,
  TblUsuarios,
} from '../../Sections/Admin/Tables'

const Admin: React.FC = () => {

  const [currentView, setCurrentView] = useState<string | null>('dashboard')
  const authContext = useContext(AuthContext)
 const navigate = useNavigate()

  const { isAuthenticated, user } = authContext || {}
 

  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene el rol de administrador
    if (!isAuthenticated || user?.idRol !== 1) {
      navigate('/')
      toast.error('No tienes permisos de administrador.')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div >
      <NavbarDashboard setCurrentView={setCurrentView} />
      {currentView === 'dashboard' && <AdminDashboard />}
      {currentView === 'profiledashboardadmin' && <ProfileAdminDashboard />}
      {currentView === 'viewcredential' && <CredentialsView />}
      {currentView === 'createcredential' && <CredentialsCreate />}
      {currentView === 'viewschedule' && <SchedulesView />}
      {currentView === 'createschedule' && <SchedulesCreate />}
      {currentView === 'infoalumn' && <InfoAlumn />}
      {currentView === 'infodocent' && <InfoDocent />}
      {currentView === 'carrusel' && <Carrusel />}
      {currentView === 'welcomeadmin' && <WelcomeAdmin />}
      {currentView === 'misionyvision' && <MisionVision />}
      {currentView === 'actividadnoticias' && <ActividadNoticias />}
      {currentView === 'actividadcultural' && <ActividadCulturalAdmin />}
      {currentView === 'inscriptionadmin' && <InscriptionAdmin />}
      {currentView === 'sobrenosotrosadmin' && <SobreNosotros />}
      {currentView === 'carrerastecnicasadmin' && <CarrerasTecnicasAdmin />}
      {currentView === 'chatadmin' && <ChatAdmin />}
      {currentView === 'infobecas' && <InfoBecas />}
      {currentView === 'tblasignaturas' && <TblAsignaturas />}
      {currentView === 'tblgrados' && <TblGrados />}
      {currentView === 'tblgrupos' && <TblGrupos />}
      {currentView === 'tblpreguntas' && <TblPreguntas />}
      {currentView === 'tblrelacionfamiliar' && <TblRelacionFamiliar />}
      {currentView === 'tbltipotrasladotransportes' && <TblTipoTraslados />}
      {currentView === 'tbltipousuarios' && <TblTipoUsuarios />}
      {currentView === 'tbltraslados' && <TblTraslados />}
      {currentView === 'tblusuarios' && <TblUsuarios />}
    </div>
  )
}

export default Admin
