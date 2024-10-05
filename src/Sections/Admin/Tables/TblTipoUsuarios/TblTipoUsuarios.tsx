import { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';


interface TipoUsuario {
  id_tipo_rol: number;
  nombre_tipo_rol: string;
}

export default function TblTipoUsuarios() {
  const [tiposUsuarios, setTiposUsuarios] = useState<TipoUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombreTipoRol, setNewNombreTipoRol] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombreTipoRol, setEditNombreTipoRol] = useState<string>('');

  useEffect(() => {
    fetch(`${apiUrl}tipo_rol`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los tipos de rol');
        }
        return response.json();
      })
      .then((data) => {
        setTiposUsuarios(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInsert = () => {
    fetch(`${apiUrl}tipo_rol/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_tipo_rol: newNombreTipoRol }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTiposUsuarios([...tiposUsuarios, { id_tipo_rol: data.id, nombre_tipo_rol: newNombreTipoRol }]);
          setNewNombreTipoRol('');
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}tipo_rol/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_tipo_rol: editNombreTipoRol }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTiposUsuarios(tiposUsuarios.map((tipo) => (tipo.id_tipo_rol === id ? { ...tipo, nombre_tipo_rol: editNombreTipoRol } : tipo)));
          setEditId(null);
          setEditNombreTipoRol('');
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
      <h1>Tipos de Usuarios</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nuevo Tipo de Usuario"
          value={newNombreTipoRol}
          onChange={(e) => setNewNombreTipoRol(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">Insertar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo de Usuario</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tiposUsuarios.map((tipo) => (
            <tr key={tipo.id_tipo_rol}>
              <td>{tipo.id_tipo_rol}</td>
              <td>
                {editId === tipo.id_tipo_rol ? (
                  <input
                    type="text"
                    value={editNombreTipoRol}
                    onChange={(e) => setEditNombreTipoRol(e.target.value)}
                  />
                ) : (
                  tipo.nombre_tipo_rol
                )}
              </td>
              <td>
                {editId === tipo.id_tipo_rol ? (
                  <button onClick={() => handleUpdate(tipo.id_tipo_rol)} className="button-update">Guardar</button>
                ) : (
                  <button onClick={() => {
                    setEditId(tipo.id_tipo_rol);
                    setEditNombreTipoRol(tipo.nombre_tipo_rol);
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
