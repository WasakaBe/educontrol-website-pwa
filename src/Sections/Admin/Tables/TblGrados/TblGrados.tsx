import  { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';

interface Grado {
  id_grado: number;
  nombre_grado: string;
}

export default function TblGrados() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreGrado, setNewNombreGrado] = useState<string>('');
  const [editId, ] = useState<number | null>(null);
  const [editNombreGrado, setEditNombreGrado] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${apiUrl}grado`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los grados');
        }
        return response.json();
      })
      .then((data) => {
        setGrados(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}grado/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_grado: newNombreGrado }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setGrados([
            ...grados,
            { id_grado: data.id, nombre_grado: newNombreGrado },
          ]);
          setNewNombreGrado('');
        }
      })
      .catch((error) => setError(error.message));
  };



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedGrados = grados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(grados.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Grados</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nuevo Grado"
          value={newNombreGrado}
          onChange={(e) => setNewNombreGrado(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">
          Insertar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Grado</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGrados.map((grado) => (
            <tr key={grado.id_grado}>
              <td>{grado.id_grado}</td>
              <td>
                {editId === grado.id_grado ? (
                  <input
                    type="text"
                    value={editNombreGrado}
                    onChange={(e) => setEditNombreGrado(e.target.value)}
                  />
                ) : (
                  grado.nombre_grado
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
