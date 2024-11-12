import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../Auto/Auth';
import { apiUrl } from '../../../../constants/Api';
import './Escolar.css';
import Modal from 'react-modal';
import { saveDataOffline, getOfflineData } from '../../../../db';

interface Alumno {
  id_alumnos: number;
  nombre_alumnos: string;
  app_alumnos: string;
  apm_alumnos: string;
  foto_alumnos?: string;
  fecha_nacimiento_alumnos: string;
  curp_alumnos: string;
  nocontrol_alumnos: number;
  telefono_alumnos: number;
  seguro_social_alumnos: number;
  cuentacredencial_alumnos: string;
  sexo: string;
  clinica: string;
  carrera_tecnica: string;
  grado: string;
  grupo: string;
  pais: string;
  estado: string;
  idTraslado: number;
  idUsuario: number;
  idTrasladotransporte: number;
  municipio_alumnos: string;
  comunidad_alumnos: string;
  calle_alumnos: string;
  proc_sec_alumno: string;
}

const Escolar: React.FC = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(1);

  const fetchAlumno = async () => {
    if (user) {
      try {
        const response = await fetch(`${apiUrl}alumno/usuario/${user.id_usuario}`);
        const data = await response.json();
        if (response.ok) {
          setAlumno(data);

          // Guardar los datos del alumno en IndexedDB usando la clave "alumnoData"
          saveDataOffline({
            key: `alumnoData-${user.id_usuario}`,
            value: JSON.stringify(data),
            timestamp: Date.now(),
          });
        } else {
          setError(data.error);
        }
      } catch (e) {
        console.error('Error al obtener la información del alumno desde la API', e);
        setError('Error al obtener la información del alumno');

        // Intentar cargar datos desde IndexedDB en caso de que falle la conexión
        const cachedData = await getOfflineData(`alumnoData-${user.id_usuario}`);
        if (cachedData) {
          setAlumno(JSON.parse(cachedData.value));
          console.log('Datos cargados desde IndexedDB:', cachedData);
        }
      }
    }
  };

  useEffect(() => {
    fetchAlumno();
  }, );

  const nextSection = () => {
    setCurrentSection(currentSection + 1);
  };

  const prevSection = () => {
    setCurrentSection(currentSection - 1);
  };

  return (
    <div className="escolar-container-view">
      <div className="escolar-container">
        <h2>Información del Alumno</h2>
        {alumno ? (
          <>
            {currentSection === 1 && (
              <div className="section">
                <h3>Información del Alumno</h3>
                <p><strong>Nombre:</strong> {alumno.nombre_alumnos}</p>
                <p><strong>Apellido Paterno:</strong> {alumno.app_alumnos}</p>
                <p><strong>Apellido Materno:</strong> {alumno.apm_alumnos}</p>
                <p><strong>Sexo:</strong> {alumno.sexo}</p>
                <p><strong>Fecha de Nacimiento:</strong> {new Date(alumno.fecha_nacimiento_alumnos).toLocaleDateString()}</p>
                <p><strong>CURP:</strong> {alumno.curp_alumnos}</p>
                <p><strong>Número de Control:</strong> {alumno.nocontrol_alumnos}</p>
                <p><strong>Teléfono:</strong> {alumno.telefono_alumnos}</p>
                <p><strong>Seguro Social:</strong> {alumno.seguro_social_alumnos}</p>
                <p><strong>Clinica:</strong> {alumno.clinica}</p>
              
                <button className="btn btn-primary" onClick={nextSection}>Siguiente</button>
              </div>
            )}

            {currentSection === 2 && (
              <div className="section">
                <h3>Información Escolar del Alumno</h3>
                <p><strong>Carrera Tecnica:</strong> {alumno.carrera_tecnica}</p>
                <p><strong>Grado:</strong> {alumno.grado}</p>
                <p><strong>Grupo:</strong> {alumno.grupo}</p>
                <p><strong>Cuenta con Credencial Fisico:</strong> {alumno.cuentacredencial_alumnos}</p>
                <button className="btn btn-secondary" onClick={prevSection}>Atrás</button>
                <button className="btn btn-primary" onClick={nextSection}>Siguiente</button>
              </div>
            )}

            {currentSection === 3 && (
              <div className="section">
                <h3>Información de Proveniencia del Alumno</h3>
                <p><strong>Pais:</strong> {alumno.pais}</p>
                <p><strong>Estado:</strong> {alumno.estado}</p>
                <p><strong>Municipio:</strong> {alumno.municipio_alumnos}</p>
                <p><strong>Comunidad:</strong> {alumno.comunidad_alumnos}</p>
                <p><strong>Calle:</strong> {alumno.calle_alumnos}</p>
                <p><strong>Procedencia Escolar:</strong> {alumno.proc_sec_alumno}</p>
     
                <button className="btn btn-secondary" onClick={prevSection}>Atrás</button>
              </div>
            )}
          </>
        ) : (
          error ? <p className="error-message">{error}</p> : <p className="loading-message">Cargando información del alumno...</p>
        )}
      </div>

      <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={closeHelpModal}
        className="modal-info-alumn"
        overlayClassName="modal-overlay-info-alumn"
      >
        <div className="help-modal-content">
          <button className="help-modal-close" onClick={closeHelpModal}>
            &times;
          </button>
          <h2>Ayuda</h2>
          <p>Si deseas actualizar tus datos debes ir a las <strong>Oficinas correspondientes</strong> para realizar los cambios.</p>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
    </div>
  );
};

export default Escolar;
