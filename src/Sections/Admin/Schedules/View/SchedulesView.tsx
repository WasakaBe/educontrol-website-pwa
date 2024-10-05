import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../constants/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

import './SchedulesView.css';

Modal.setAppElement('#root');

interface DiaHorario {
  day: string;
  startTime: string;
  endTime: string;
  [key: string]: string;
}

interface Horario {
  id_horario: number;
  nombre_asignatura: string;
  nombre_docente: string;
  nombre_grado: string;
  nombre_grupo: string;
  nombre_carrera_tecnica: string;
  ciclo_escolar: string;
  dias_horarios: DiaHorario[] | null;
  id_docente: number;
}

interface Asignatura {
  id_asignatura: number;
  nombre_asignatura: string;
}

interface Docente {
  id_docentes: number;
  nombre_docentes: string;
  app_docentes: string;
  apm_docentes: string;
}

interface Grado {
  id_grado: number;
  nombre_grado: string;
}

interface Grupo {
  id_grupos: number;
  nombre_grupos: string;
}

interface CarreraTecnica {
  id_carrera_tecnica: number;
  nombre_carrera_tecnica: string;
}

const SchedulesView: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carrerasTecnicas, setCarrerasTecnicas] = useState<CarreraTecnica[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [horariosRes, asignaturasRes, docentesRes, gradosRes, gruposRes, carrerasTecnicasRes] = await Promise.all([
          fetch(`${apiUrl}horarios_escolares`).then(res => res.json()),
          fetch(`${apiUrl}asignatura`).then(res => res.json()),
          fetch(`${apiUrl}docente`).then(res => res.json()),
          fetch(`${apiUrl}grado`).then(res => res.json()),
          fetch(`${apiUrl}grupo`).then(res => res.json()),
          fetch(`${apiUrl}carreras/tecnicas`).then(res => res.json())
        ]);

        if (Array.isArray(horariosRes)) {
          setHorarios(horariosRes);
        } else {
          toast.error('Error fetching data: Data is not an array');
        }

        if (asignaturasRes && asignaturasRes.asignaturas) {
          setAsignaturas(asignaturasRes.asignaturas);
        } else {
          toast.error('Error fetching subjects: Data is not an array');
        }

        if (Array.isArray(docentesRes)) {
          setDocentes(docentesRes);
        } else {
          toast.error('Error fetching teachers: Data is not an array');
        }

        if (Array.isArray(gradosRes)) {
          setGrados(gradosRes);
        } else {
          toast.error('Error fetching grades: Data is not an array');
        }

        if (Array.isArray(gruposRes)) {
          setGrupos(gruposRes);
        } else {
          toast.error('Error fetching groups: Data is not an array');
        }

        if (carrerasTecnicasRes && carrerasTecnicasRes.carreras) {
          setCarrerasTecnicas(carrerasTecnicasRes.carreras);
        } else {
          toast.error('Error fetching technical careers: Data is not an array');
        }
      } catch  {
        toast.error(`Error fetching data`);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHorario(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedHorario(null);
    setIsDeleteModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedHorario) {
      const { name, value } = e.target;
      setSelectedHorario({ ...selectedHorario, [name]: value });
    }
  };

  const handleDiaHorarioChange = (index: number, field: string, value: string) => {
    if (selectedHorario && selectedHorario.dias_horarios) {
      const updatedDiasHorarios = [...selectedHorario.dias_horarios];
      if (updatedDiasHorarios[index]) {
        updatedDiasHorarios[index][field] = value;
      } else {
        updatedDiasHorarios[index] = { day: '', startTime: '', endTime: '', [field]: value };
      }
      setSelectedHorario({
        ...selectedHorario,
        dias_horarios: updatedDiasHorarios,
      });
    }
  };

  const handleSubmit = () => {
    if (selectedHorario) {
      fetch(`${apiUrl}horarios_escolares/update/${selectedHorario.id_horario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedHorario),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error updating schedule');
          }
          return response.json();
        })
        .then((data) => {
          setHorarios(
            horarios.map((horario) => (horario.id_horario === data.id_horario ? data : horario))
          );
          toast.success('Horario actualizado exitosamente');
          closeModal();
        })
        .catch((error) => {
          toast.error(`Error updating schedule: ${error.message}`);
        });
    }
  };

  const handleDelete = () => {
    if (selectedHorario) {
      fetch(`${apiUrl}horarios_escolares/delete/${selectedHorario.id_horario}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error deleting schedule');
          }
          setHorarios(horarios.filter((horario) => horario.id_horario !== selectedHorario.id_horario));
          toast.success('Horario eliminado exitosamente');
          closeDeleteModal();
        })
        .catch((error) => {
          toast.error(`Error deleting schedule: ${error.message}`);
        });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = horarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(horarios.length / itemsPerPage);

  return (
    <div className="container-credentials-view-admin">
      <ToastContainer />
      <h2>Horarios Escolares</h2>
      <table className="table-credentials-view-admin">
        <thead className="thead-credentials-view-admin">
          <tr className="tr-credentials-view-admin">
            <th>ID</th>
            <th>Asignatura</th>
            <th>Docente</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Carrera Técnica</th>
            <th>Ciclo Escolar</th>
            <th>Días y Horarios</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody className="tbody-credentials-view-admin">
          {currentItems.map((horario) => (
            <tr key={horario.id_horario} className="tr-credentials-view-admin">
              <td>{horario.id_horario}</td>
              <td>{horario.nombre_asignatura}</td>
              <td>{horario.nombre_docente}</td>
              <td>{horario.nombre_grado}</td>
              <td>{horario.nombre_grupo}</td>
              <td>{horario.nombre_carrera_tecnica}</td>
              <td>{horario.ciclo_escolar}</td>
              <td>
                {Array.isArray(horario.dias_horarios) && horario.dias_horarios.length > 0 ? (
                  horario.dias_horarios.map((dia, index) => (
                    <div key={index}>
                      <span>{dia.day}: </span>
                      <span>
                        {dia.startTime} - {dia.endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <span>No se encontraron días y horarios</span>
                )}
              </td>
              <td className="align">
                <button className="btn-view" onClick={() => openModal(horario)}>
                  Actualizar
                </button>
                <button className="edit-button" onClick={() => openDeleteModal(horario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-schedules-view">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button-schedules-view ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-schedules-view">
        <h2>Actualizar Horario</h2>
        {selectedHorario && (
          <form>
            <label>
              Asignatura:
              <select
                name="nombre_asignatura"
                value={selectedHorario.nombre_asignatura}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una asignatura</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura.id_asignatura} value={asignatura.nombre_asignatura}>
                    {asignatura.nombre_asignatura}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Docente:
              <select
                name="nombre_docente"
                value={selectedHorario.nombre_docente}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un docente</option>
                {docentes.map((docente) => (
                  <option
                    key={docente.id_docentes}
                    value={`${docente.nombre_docentes} ${docente.app_docentes} ${docente.apm_docentes}`}
                  >
                    {docente.nombre_docentes} {docente.app_docentes} {docente.apm_docentes}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Grado:
              <select
                name="nombre_grado"
                value={selectedHorario.nombre_grado}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un grado</option>
                {grados.map((grado) => (
                  <option key={grado.id_grado} value={grado.nombre_grado}>
                    {grado.nombre_grado}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Grupo:
              <select
                name="nombre_grupo"
                value={selectedHorario.nombre_grupo}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id_grupos} value={grupo.nombre_grupos}>
                    {grupo.nombre_grupos}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Carrera Técnica:
              <select
                name="nombre_carrera_tecnica"
                value={selectedHorario.nombre_carrera_tecnica}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una carrera técnica</option>
                {carrerasTecnicas.map((carrera) => (
                  <option key={carrera.id_carrera_tecnica} value={carrera.nombre_carrera_tecnica}>
                    {carrera.nombre_carrera_tecnica}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ciclo Escolar:
              <input
                type="text"
                name="ciclo_escolar"
                value={selectedHorario.ciclo_escolar}
                onChange={handleInputChange}
              />
            </label>
            {selectedHorario.dias_horarios &&
              selectedHorario.dias_horarios.map((dia, index) => (
                <div key={index}>
                  <label>
                    Día:
                    <input
                      type="text"
                      value={dia.day}
                      onChange={(e) => handleDiaHorarioChange(index, 'day', e.target.value)}
                    />
                  </label>
                  <label>
                    Hora de Inicio:
                    <input
                      type="time"
                      value={dia.startTime}
                      onChange={(e) => handleDiaHorarioChange(index, 'startTime', e.target.value)}
                    />
                  </label>
                  <label>
                    Hora de Fin:
                    <input
                      type="time"
                      value={dia.endTime}
                      onChange={(e) => handleDiaHorarioChange(index, 'endTime', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            <button className="save-button-schedules-view" type="button" onClick={handleSubmit}>
              Guardar Cambios
            </button>
          </form>
        )}
        <button className="close-button-schedules-view" onClick={closeModal}>
          Cerrar
        </button>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal-mision">
        <div className="modal-custom">
          <h2>Eliminar Horario</h2>
          <div className="align2">
            <h3>¿Estás seguro de eliminar este horario escolar?</h3>
          </div>
          <div className="align2">
            <button className="delete-button" onClick={handleDelete}>
              Eliminar
            </button>
            <button className="info-button" onClick={closeDeleteModal}>
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SchedulesView;
