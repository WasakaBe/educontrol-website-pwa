import { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';
import './TblAsignaturas.css';

interface Asignatura {
  id_asignatura: number;
  nombre_asignatura: string;
}

export default function TblAsignaturas() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreAsignatura, setNewNombreAsignatura] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombreAsignatura, setEditNombreAsignatura] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${apiUrl}asignatura`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las asignaturas');
        }
        return response.json();
      })
      .then((data) => {
        setAsignaturas(data.asignaturas);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}asignatura/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_asignatura: newNombreAsignatura }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setAsignaturas([
            ...asignaturas,
            { id_asignatura: data.id, nombre_asignatura: newNombreAsignatura },
          ]);
          setNewNombreAsignatura('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}asignatura/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_asignatura: editNombreAsignatura }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setAsignaturas(
            asignaturas.map((asignatura) =>
              asignatura.id_asignatura === id
                ? { ...asignatura, nombre_asignatura: editNombreAsignatura }
                : asignatura
            )
          );
          setEditId(null);
          setEditNombreAsignatura('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedAsignaturas = asignaturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(asignaturas.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Asignaturas</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nueva Asignatura"
          value={newNombreAsignatura}
          onChange={(e) => setNewNombreAsignatura(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">Insertar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asignatura</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAsignaturas.map((asignatura) => (
            <tr key={asignatura.id_asignatura}>
              <td>{asignatura.id_asignatura}</td>
              <td>
                {editId === asignatura.id_asignatura ? (
                  <input
                    type="text"
                    value={editNombreAsignatura}
                    onChange={(e) => setEditNombreAsignatura(e.target.value)}
                  />
                ) : (
                  asignatura.nombre_asignatura
                )}
              </td>
              <td>
                {editId === asignatura.id_asignatura ? (
                  <button onClick={() => handleUpdate(asignatura.id_asignatura)} className="button-update">Guardar</button>
                ) : (
                  <button onClick={() => {
                    setEditId(asignatura.id_asignatura);
                    setEditNombreAsignatura(asignatura.nombre_asignatura);
                  }} className="button-update">Actualizar</button>
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
