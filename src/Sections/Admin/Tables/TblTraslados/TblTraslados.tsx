import  { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';


interface Traslado {
  id_traslado: number;
  nombre_traslado: string;
}

export default function TblTraslados() {
  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreTraslado, setNewNombreTraslado] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombreTraslado, setEditNombreTraslado] = useState<string>('');

  useEffect(() => {
    fetch(`${apiUrl}traslado`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los traslados');
        }
        return response.json();
      })
      .then((data) => {
        setTraslados(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}traslado/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_traslado: newNombreTraslado }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTraslados([...traslados, { id_traslado: data.id, nombre_traslado: newNombreTraslado }]);
          setNewNombreTraslado('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}traslado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_traslado: editNombreTraslado }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTraslados(traslados.map((traslado) => (traslado.id_traslado === id ? { ...traslado, nombre_traslado: editNombreTraslado } : traslado)));
          setEditId(null);
          setEditNombreTraslado('');
        }
      })
      .catch((error) => setError(error.message));
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-asignaturas">
      <h1>Traslados</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nuevo Traslado"
          value={newNombreTraslado}
          onChange={(e) => setNewNombreTraslado(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">Insertar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Traslado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {traslados.map((traslado) => (
            <tr key={traslado.id_traslado}>
              <td>{traslado.id_traslado}</td>
              <td>
                {editId === traslado.id_traslado ? (
                  <input
                    type="text"
                    value={editNombreTraslado}
                    onChange={(e) => setEditNombreTraslado(e.target.value)}
                  />
                ) : (
                  traslado.nombre_traslado
                )}
              </td>
              <td>
                {editId === traslado.id_traslado ? (
                  <button onClick={() => handleUpdate(traslado.id_traslado)} className="button-update">Guardar</button>
                ) : (
                  <button onClick={() => {
                    setEditId(traslado.id_traslado);
                    setEditNombreTraslado(traslado.nombre_traslado);
                  }} className="button-update">Actualizar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
