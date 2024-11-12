import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Auto/Auth';
import { apiUrl } from '../../../constants/Api';
import './CredentialsDocent.css';
import { logo_cbta, logoeducacion } from '../../../assets/logos';
import { Docente } from '../../../constants/interfaces';
import { saveDataOffline, getOfflineData } from '../../../db';

const CredentialsDocent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [docente, setDocente] = useState<Docente | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocente = async () => {
      if (user) {
        try {
          const response = await fetch(`${apiUrl}docente/usuario/${user.id_usuario}`);
          const data = await response.json();
          if (response.ok) {
            setDocente(data);

            // Guardar los datos del docente en IndexedDB
            saveDataOffline({
              key: `docenteData-${user.id_usuario}`,
              value: JSON.stringify(data),
              timestamp: Date.now(),
            });
          } else {
            setError(data.error);
          }
        } catch {
          setError('Error al obtener la información del docente');

          // Intentar cargar datos del docente desde IndexedDB si falla la conexión
          const cachedData = await getOfflineData(`docenteData-${user.id_usuario}`);
          if (cachedData) {
            const parsedData = JSON.parse(cachedData.value);
            setDocente(parsedData);
            console.log('Datos del docente cargados desde IndexedDB:', parsedData);
          }
        }
      }
    };

    fetchDocente();
  }, [user]);

  return (
    <div className="credential-container">
      {docente ? (
        <div className="credential-card">
          <div className="header">
            <img src={logoeducacion} alt="Logo SEP" className="sep-logo" />
            <img src={logo_cbta} alt="Logo CBTA 5" className="cbta-logo" />
          </div>
          <div className="body-credencial">
            <div className="photo-section">
              <img
                src={
                  docente.foto_docentes
                    ? `data:image/jpeg;base64,${docente.foto_docentes}`
                    : 'default-photo.png'
                }
                alt="Foto del Docente"
                className="student-photo-docente"
              />
              <h2 className="student-name">
                {docente.nombre_docentes} {docente.app_docentes} {docente.apm_docentes}
              </h2>
            </div>
            <div className="info-section-docente">
              <p><strong>Número de Control:</strong> {docente.noconttrol_docentes}</p>
              <p><strong>Teléfono:</strong> {docente.telefono_docentes}</p>
              <p><strong>Seguro Social:</strong> {docente.seguro_social_docentes}</p>
              <p><strong>Clínica:</strong> {docente.clinica}</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="loading-message">Cargando información del docente...</p>
      )}
    </div>
  );
};

export default CredentialsDocent;
