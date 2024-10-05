import { useEffect, useState } from 'react'
import { apiUrl } from '../../../../constants/Api'

interface Grupo {
  id_grupos: number
  nombre_grupos: string
}

export default function TblGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newNombreGrupos, setNewNombreGrupos] = useState<string>('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editNombreGrupos, setEditNombreGrupos] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetch(`${apiUrl}grupo`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los grupos')
        }
        return response.json()
      })
      .then((data) => {
        setGrupos(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  const handleInsert = () => {
    fetch(`${apiUrl}grupo/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_grupos: newNombreGrupos }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setGrupos([
            ...grupos,
            { id_grupos: data.id, nombre_grupos: newNombreGrupos },
          ])
          setNewNombreGrupos('')
        }
      })
      .catch((error) => setError(error.message))
  }

  const handleUpdate = (id: number) => {
    fetch(`${apiUrl}grupo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_grupos: editNombreGrupos }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setGrupos(
            grupos.map((grupo) =>
              grupo.id_grupos === id
                ? { ...grupo, nombre_grupos: editNombreGrupos }
                : grupo
            )
          )
          setEditId(null)
          setEditNombreGrupos('')
        }
      })
      .catch((error) => setError(error.message))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedGrupos = grupos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(grupos.length / itemsPerPage)

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="container-asignaturas">
      <h1>Grupos</h1>
      <div className="insert-section">
        <input
          type="text"
          placeholder="Nuevo Grupo"
          value={newNombreGrupos}
          onChange={(e) => setNewNombreGrupos(e.target.value)}
        />
        <button onClick={handleInsert} className="button-insert">
          Insertar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Grupo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGrupos.map((grupo) => (
            <tr key={grupo.id_grupos}>
              <td>{grupo.id_grupos}</td>
              <td>
                {editId === grupo.id_grupos ? (
                  <input
                    type="text"
                    value={editNombreGrupos}
                    onChange={(e) => setEditNombreGrupos(e.target.value)}
                  />
                ) : (
                  grupo.nombre_grupos
                )}
              </td>
              <td>
                {editId === grupo.id_grupos ? (
                  <button
                    onClick={() => handleUpdate(grupo.id_grupos)}
                    className="button-update"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(grupo.id_grupos)
                      setEditNombreGrupos(grupo.nombre_grupos)
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
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  )
}
