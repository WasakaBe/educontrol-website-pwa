import  { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';


interface TrasladoTransporte {
  id_traslado_transporte: number;
  nombre_traslado_transporte: string;
}

export default function TblTipoTraslados() {
  const [trasladosTransporte, setTrasladosTransporte] = useState<TrasladoTransporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreTrasladoTransporte, setNewNombreTrasladoTransporte] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombreTrasladoTransporte, setEditNombreTrasladoTransporte] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${apiUrl}traslado_transporte`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los traslados de transporte');
        }
        return response.json();
      })
      .then((data) => {
        setTrasladosTransporte(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}traslado_transporte/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_traslado_transporte: newNombreTrasladoTransporte }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTrasladosTransporte([
            ...trasladosTransporte,
            { id_traslado_transporte: data.id, nombre_traslado_transporte: newNombreTrasladoTransporte },
          ]);
          setNewNombreTrasladoTransporte('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}traslado_transporte/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_traslado_transporte: editNombreTrasladoTransporte }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTrasladosTransporte(
            trasladosTransporte.map((traslado) =>
              traslado.id_traslado_transporte === id
                ? { ...traslado, nombre_traslado_transporte: editNombreTrasladoTransporte }
                : traslado
            )
          );
          setEditId(null);
          setEditNombreTrasladoTransporte('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedTraslados = trasladosTransporte.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(trasladosTransporte.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Tipos de Traslados</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nuevo Tipo de Traslado"
          value={newNombreTrasladoTransporte}
          onChange={(e) => setNewNombreTrasladoTransporte(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">
          Insertar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo de Traslado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTraslados.map((traslado) => (
            <tr key={traslado.id_traslado_transporte}>
              <td>{traslado.id_traslado_transporte}</td>
              <td>
                {editId === traslado.id_traslado_transporte ? (
                  <input
                    type="text"
                    value={editNombreTrasladoTransporte}
                    onChange={(e) =>
                      setEditNombreTrasladoTransporte(e.target.value)
                    }
                  />
                ) : (
                  traslado.nombre_traslado_transporte
                )}
              </td>
              <td>
                {editId === traslado.id_traslado_transporte ? (
                  <button
                    onClick={() => handleUpdate(traslado.id_traslado_transporte)}
                    className="button-update"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(traslado.id_traslado_transporte);
                      setEditNombreTrasladoTransporte(traslado.nombre_traslado_transporte);
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
