import  { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';


interface RelacionFamiliar {
  id_relacion_familiar: number;
  nombre_relacion_familiar: string;
}

export default function TblRelacionFamiliar() {
  const [relacionesFamiliares, setRelacionesFamiliares] = useState<RelacionFamiliar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreRelacionFamiliar, setNewNombreRelacionFamiliar] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombreRelacionFamiliar, setEditNombreRelacionFamiliar] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${apiUrl}relaciones_familiares`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las relaciones familiares');
        }
        return response.json();
      })
      .then((data) => {
        setRelacionesFamiliares(data.relaciones_familiares);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}relaciones_familiares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_relacion_familiar: newNombreRelacionFamiliar }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.includes('ya está registrada')) {
          setError(data.message);
        } else if (data.message) {
          setRelacionesFamiliares([
            ...relacionesFamiliares,
            {
              id_relacion_familiar: data.id,
              nombre_relacion_familiar: newNombreRelacionFamiliar,
            },
          ]);
          setNewNombreRelacionFamiliar('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}relaciones_familiares/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_relacion_familiar: editNombreRelacionFamiliar }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.includes('error')) {
          setError(data.message);
        } else {
          setRelacionesFamiliares(
            relacionesFamiliares.map((relacion) =>
              relacion.id_relacion_familiar === id
                ? { ...relacion, nombre_relacion_familiar: editNombreRelacionFamiliar }
                : relacion
            )
          );
          setEditId(null);
          setEditNombreRelacionFamiliar('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedRelaciones = relacionesFamiliares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(relacionesFamiliares.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Relaciones Familiares</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nueva Relación Familiar"
          value={newNombreRelacionFamiliar}
          onChange={(e) => setNewNombreRelacionFamiliar(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">
          Insertar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Relación Familiar</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRelaciones.map((relacion) => (
            <tr key={relacion.id_relacion_familiar}>
              <td>{relacion.id_relacion_familiar}</td>
              <td>
                {editId === relacion.id_relacion_familiar ? (
                  <input
                    type="text"
                    value={editNombreRelacionFamiliar}
                    onChange={(e) => setEditNombreRelacionFamiliar(e.target.value)}
                  />
                ) : (
                  relacion.nombre_relacion_familiar
                )}
              </td>
              <td>
                {editId === relacion.id_relacion_familiar ? (
                  <button onClick={() => handleUpdate(relacion.id_relacion_familiar)} className="button-update">
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(relacion.id_relacion_familiar);
                      setEditNombreRelacionFamiliar(relacion.nombre_relacion_familiar);
                    }}
                    className="button-update"
                  >
                    Actualizar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-button ${page === currentPage ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
