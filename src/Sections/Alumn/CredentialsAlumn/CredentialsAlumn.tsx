import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Auto/Auth';
import { apiUrl } from '../../../constants/Api';
import './CredentialsAlumn.css';
import { logo_cbta, logoeducacion } from '../../../assets/logos';

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
  foto_carrera_tecnica: string;
}

const CredentialsAlumn: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlumno = async () => {
      if (user) {
        try {
          const response = await fetch(`${apiUrl}alumno/usuario/${user.id_usuario}`);
          const data = await response.json();
          if (response.ok) {
            setAlumno(data);
          } else {
            setError(data.error);
          }
        } catch {
          setError('Error al obtener la información del alumno');
        }
      }
    };

    fetchAlumno();
  }, [user]);

  return (
    <div className="credential-container">
      {alumno ? (
        <div className="credential-card">
          <div className="header">
            <img src={logoeducacion} alt="Logo SEP" className="sep-logo" />
            <img src={logo_cbta} alt="Logo CBTA 5" className="cbta-logo" />
          </div>
          <div className="body-credencial">
            <div className="photo-section">
              <img
                src={
                  alumno.foto_alumnos
                    ? `data:image/jpeg;base64,${alumno.foto_alumnos}`
                    : 'default-photo.png'
                }
                alt="Foto del Alumno"
                className="student-photo-alumn"
              />
              <div className='name-logo-credential'>
                <h2 className="student-name">
                  {alumno.nombre_alumnos} {alumno.app_alumnos} {alumno.apm_alumnos}
                </h2>
                <img
                  src={
                    alumno.foto_carrera_tecnica
                      ? `data:image/jpeg;base64,${alumno.foto_carrera_tecnica}`
                      : 'default-logo.png'
                  }
                  alt="Logo de la Carrera"
                  className="career-logo"
                />
              </div>
            </div>
            <div className="info-section-crede">
              <h3>TÉCNICO EN {alumno.carrera_tecnica.toUpperCase()}</h3>
              <p><strong>GRUPO:</strong> {alumno.grupo}</p>
              <p><strong>CURP:</strong> {alumno.curp_alumnos}</p>
              <p><strong>MATRÍCULA:</strong> {alumno.nocontrol_alumnos}</p>
              <p><strong>SEGURO SOCIAL:</strong> {alumno.seguro_social_alumnos}</p>
            </div>
         
          </div>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="loading-message">Cargando información del alumno...</p>
      )}
    </div>
  );
};

export default CredentialsAlumn;
