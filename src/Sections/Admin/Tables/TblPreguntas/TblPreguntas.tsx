import  { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';


interface Pregunta {
  id_preguntas: number;
  nombre_preguntas: string;
}

export default function TblPreguntas() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombrePreguntas, setNewNombrePreguntas] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombrePreguntas, setEditNombrePreguntas] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${apiUrl}pregunta`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las preguntas');
        }
        return response.json();
      })
      .then((data) => {
        setPreguntas(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}pregunta/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_preguntas: newNombrePreguntas }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPreguntas([...preguntas, { id_preguntas: data.id, nombre_preguntas: newNombrePreguntas }]);
          setNewNombrePreguntas('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}pregunta/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_preguntas: editNombrePreguntas }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPreguntas(preguntas.map((pregunta) => (pregunta.id_preguntas === id ? { ...pregunta, nombre_preguntas: editNombrePreguntas } : pregunta)));
          setEditId(null);
          setEditNombrePreguntas('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPreguntas = preguntas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(preguntas.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Preguntas</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nueva Pregunta"
          value={newNombrePreguntas}
          onChange={(e) => setNewNombrePreguntas(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">Insertar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pregunta</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPreguntas.map((pregunta) => (
            <tr key={pregunta.id_preguntas}>
              <td>{pregunta.id_preguntas}</td>
              <td>
                {editId === pregunta.id_preguntas ? (
                  <input
                    type="text"
                    value={editNombrePreguntas}
                    onChange={(e) => setEditNombrePreguntas(e.target.value)}
                  />
                ) : (
                  pregunta.nombre_preguntas
                )}
              </td>
              <td>
                {editId === pregunta.id_preguntas ? (
                  <button onClick={() => handleUpdate(pregunta.id_preguntas)} className="button-update">Guardar</button>
                ) : (
                  <button onClick={() => {
                    setEditId(pregunta.id_preguntas);
                    setEditNombrePreguntas(pregunta.nombre_preguntas);
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
