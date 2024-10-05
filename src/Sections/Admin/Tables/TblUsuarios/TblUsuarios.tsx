import { useEffect, useState } from 'react';
import { apiUrl } from '../../../../constants/Api';
import './TblUsuarios.css'

interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  app_usuario: string;
  apm_usuario: string;
  fecha_nacimiento_usuario: string;
  token_usuario: string;
  correo_usuario: string;
  pwd_usuario: string;
  phone_usuario: string;
  ip_usuario: string;
  id_rol: number;
  nombre_rol: string;
  id_sexo: number;
  id_cuenta_activo: number;
  id_pregunta: number;
  respuesta_pregunta: string;
  foto_usuario: string | null;
}

export default function TblUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetch(`${apiUrl}usuario`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedUsuarios = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  if (loading) {
    return <div className="loading--table-users">Cargando...</div>;
  }

  if (error) {
    return <div className="error--table-users">Error: {error}</div>;
  }

  return (
    <div className="container--table-users">
      <h1 className="title--table-users">Usuarios</h1>

      <table className="table--table-users">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Correo Electronico</th>
            <th>Tipo de Usuario</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td data-label="ID">{usuario.id_usuario}</td>
              <td data-label="Nombre">{usuario.nombre_usuario}</td>
              <td data-label="Apellido Paterno">{usuario.app_usuario}</td>
              <td data-label="Apellido Materno">{usuario.apm_usuario}</td>
              <td data-label="Correo Electronico">{usuario.correo_usuario}</td>
              <td data-label="Tipo de Usuario">{usuario.nombre_rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination--table-users">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-button--table-users ${page === currentPage ? 'active--table-users' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
