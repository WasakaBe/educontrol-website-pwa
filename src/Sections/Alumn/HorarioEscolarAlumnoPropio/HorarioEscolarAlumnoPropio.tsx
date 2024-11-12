import React, { useEffect, useState, useContext } from 'react';
import { apiUrl } from '../../../constants/Api';
import { Asignatura } from '../../../constants/interfaces';
import { AuthContext } from '../../../Auto/Auth';
import { saveDataOffline, getOfflineData } from '../../../db';

const HorarioEscolarAlumnoPropio: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const asignaturasPerPage = 4;

  useEffect(() => {
    const fetchAsignaturas = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${apiUrl}asignaturas/alumno/id/${user.id_usuario}`
          );
          const data = await response.json();
          console.log('Asignaturas data:', data);
          if (response.ok) {
            setAsignaturas(data);

            // Guardar los datos de asignaturas en IndexedDB usando la clave única
            saveDataOffline({
              key: `asignaturasData-${user.id_usuario}`,
              value: JSON.stringify(data),
              timestamp: Date.now(),
            });
          } else {
            setError(data.error);
          }
        } catch (e) {
          console.error('Error al obtener las asignaturas del alumno desde la API', e);
          setError('Error al obtener las asignaturas del alumno');

          // Intentar cargar datos desde IndexedDB si no hay conexión
          const cachedData = await getOfflineData(`asignaturasData-${user.id_usuario}`);
          if (cachedData) {
            setAsignaturas(JSON.parse(cachedData.value));
            console.log('Datos de asignaturas cargados desde IndexedDB:', cachedData);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAsignaturas();
  }, [user]);

  const indexOfLastAsignatura = currentPage * asignaturasPerPage;
  const indexOfFirstAsignatura = indexOfLastAsignatura - asignaturasPerPage;
  const currentAsignaturas = asignaturas.slice(
    indexOfFirstAsignatura,
    indexOfLastAsignatura
  );
  const totalPages = Math.ceil(asignaturas.length / asignaturasPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <p className="loading-message">Cargando asignaturas...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="container-asignaturas">
      <h2>Asignaturas Asignadas</h2>
      {asignaturas.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Docente</th>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Carrera Técnica</th>
                <th>Ciclo Escolar</th>
                <th>Días y Horarios</th>
              </tr>
            </thead>
            <tbody>
              {currentAsignaturas.map((asignatura) => (
                <tr key={asignatura.id_asignatura}>
                  <td>{asignatura.nombre_asignatura}</td>
                  <td>{asignatura.nombre_docente}</td>
                  <td>{asignatura.nombre_grado}</td>
                  <td>{asignatura.nombre_grupo}</td>
                  <td>{asignatura.nombre_carrera_tecnica}</td>
                  <td>{asignatura.ciclo_escolar}</td>
                  <td>
                    {asignatura.dias_horarios.map((dia) => (
                      <div key={dia.day + dia.startTime}>
                        {dia.day}: {dia.startTime} - {dia.endTime}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <span
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-link ${index + 1 === currentPage ? 'active' : ''}`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p>No hay asignaturas asignadas</p>
      )}
    </div>
  );
};

export default HorarioEscolarAlumnoPropio;
