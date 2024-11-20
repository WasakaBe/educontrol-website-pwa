import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Auto/Auth'
import { apiUrl } from '../../../constants/Api'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './HorarioDocente.css'
import { Horario, Alumno } from '../../../constants/interfaces'

const HorarioDocente: React.FC = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false)

  const openHelpModal = () => {
    setIsHelpModalOpen(true)
  }

  const closeHelpModal = () => {
    setIsHelpModalOpen(false)
  }

  const authContext = useContext(AuthContext)
  const user = authContext?.user
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [nocontrolAlumno, setNocontrolAlumno] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [currentAlumnoIndex, setCurrentAlumnoIndex] = useState(0)
  const [attendance, setAttendance] = useState<{
    [key: number]: { attended: boolean; comment: string }
  }>({})
  const alumnosPerPage = 5

  const generateAlumnosPdf = (horario: Horario | null, alumnos: Alumno[]) => {
    if (!horario) {
      toast.error("No se ha seleccionado un horario.");
      return;
    }
  
    const doc = new jsPDF();
    const tableColumn = ["Nombre Completo", "Número de Control"];
    const tableRows: string[][] = [];
  
    alumnos.forEach((alumno) => {
      const alumnoData = [
        `${alumno.nombre_alumnos} ${alumno.app_alumnos} ${alumno.apm_alumnos}`,
        alumno.nocontrol_alumnos,
      ];
      tableRows.push(alumnoData);
    });
  
    const { nombre_asignatura, nombre_docente, nombre_grado, nombre_grupo, nombre_carrera_tecnica } =
      horario;
  
    doc.setFillColor(0, 118, 0);
    doc.rect(0, 0, 210, 20, "F");
  
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("LISTA DE ALUMNOS", 105, 12, { align: "center" });
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    let yOffset = 30;
    const lineSpacing = 10;
  
    doc.text(`Asignatura: ${nombre_asignatura}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Docente: ${nombre_docente}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Grado: ${nombre_grado}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Grupo: ${nombre_grupo}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Carrera Técnica: ${nombre_carrera_tecnica}`, 14, yOffset);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yOffset + 12,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 118, 0],
        textColor: [255, 255, 255],
      },
    });
  
    const pdfFileName = `lista_alumnos_horario_${horario.id_horario}.pdf`;
    doc.save(pdfFileName);
  };
  

  useEffect(() => {
    const fetchHorarios = async () => {
      if (user) {
        try {
          const response = await fetch(`${apiUrl}horarios_escolares/docente/${user.id_usuario}`);
          const data = await response.json();
          if (response.ok) {
            setHorarios(data);
          } else {
            setError(data.error);
          }
        } catch {
          setError('Error al obtener los horarios del docente');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHorarios();
  }, [user]);

  const openModal = async (horario: Horario) => {
    setSelectedHorario(horario);
    try {
      const response = await fetch(`${apiUrl}alumnos/horario/${horario.id_horario}`);
      const data = await response.json();
      if (response.ok) {
        setAlumnos(data);
      } else {
        setAlumnos([]);
      }
    } catch {
      setAlumnos([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setAlumnos([])
    setCurrentPage(1)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setNocontrolAlumno('')
  }

  const openInitialModal = (horario: Horario) => {
    setSelectedHorario(horario)
    setIsInitialModalOpen(true)
  }

  const closeInitialModal = () => {
    setIsInitialModalOpen(false)
    setCurrentDate('')
  }

  const openAttendanceModal = async () => {
    if (selectedHorario) {
      try {
        const response = await fetch(`${apiUrl}alumnos/horario/${selectedHorario.id_horario}`);
        const data = await response.json();
        if (response.ok) {
          setAlumnos(data);
          setIsInitialModalOpen(false);
          setIsAttendanceModalOpen(true);
        } else {
          setAlumnos([]);
        }
      } catch {
        setAlumnos([]);
        toast.error('No se pudieron cargar los alumnos para el horario seleccionado.');
      }
    }
  };

  const closeAttendanceModal = () => {
    setIsAttendanceModalOpen(false)
    setCurrentDate('')
    setCurrentAlumnoIndex(0)
  }

  const handleAddAlumno = async () => {
    if (!nocontrolAlumno) {
      toast.error('Por favor, ingrese el número de control del alumno.');
      return;
    }
  
    try {
      const response = await fetch(
        `${apiUrl}horarios_escolares/${selectedHorario?.id_horario}/agregar_alumno`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nocontrol_alumnos: nocontrolAlumno }),
        }
      );
  
      if (response.ok) {
        const newAlumno = await response.json();
        setAlumnos((prevAlumnos) => [...prevAlumnos, newAlumno]);
        toast.success('Alumno agregado exitosamente.');
        closeAddModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al agregar el alumno.');
      }
    } catch {
      toast.error('Error al agregar el alumno.');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const indexOfLastAlumno = currentPage * alumnosPerPage
  const indexOfFirstAlumno = indexOfLastAlumno - alumnosPerPage
  const currentAlumnos = alumnos.slice(indexOfFirstAlumno, indexOfLastAlumno)

  const renderPageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(alumnos.length / alumnosPerPage); i++) {
      pageNumbers.push(i)
    }
    return pageNumbers.map((number) => (
      <button
        key={number}
        className={`page-button ${currentPage === number ? 'active' : ''}`}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </button>
    ))
  }

  const handleAttendanceChange = (index: number, attended: boolean) => {
    const alumnoId = alumnos[index].id_alumnos
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [alumnoId]: {
        ...prevAttendance[alumnoId],
        attended,
      },
    }))
  }

  const isChecked = (index: number, value: boolean) => {
    const alumnoId = alumnos[index].id_alumnos
    return attendance[alumnoId]?.attended === value
  }

  const handleCommentChange = (index: number, comment: string) => {
    const alumnoId = alumnos[index].id_alumnos
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [alumnoId]: {
        ...prevAttendance[alumnoId],
        comment,
      },
    }))
  }

  const handleNextAlumno = () => {
    if (currentAlumnoIndex < alumnos.length - 1) {
      setCurrentAlumnoIndex(currentAlumnoIndex + 1)
    }
  }

  const handlePreviousAlumno = () => {
    if (currentAlumnoIndex > 0) {
      setCurrentAlumnoIndex(currentAlumnoIndex - 1)
    }
  }

  const handleSaveAttendance = async () => {
    if (!selectedHorario || !currentDate) {
      toast.error('Horario o fecha no seleccionados.');
      return;
    }
  
    try {
      const alumno = alumnos[currentAlumnoIndex];
      const attendanceRecord = attendance[alumno.id_alumnos];
      const attendanceStatus = attendanceRecord && attendanceRecord.attended ? 'Asistió' : 'No asistió';
  
      const attendanceData = {
        id_alumno: alumno.id_alumnos,
        id_horario: selectedHorario.id_horario,
        fecha: new Date(currentDate).toISOString().replace('T', ' ').substring(0, 19),
        estado_asistencia: attendanceStatus,
        comentarios: attendanceRecord ? attendanceRecord.comment : '',
      };
  
      const response = await fetch(`${apiUrl}asistencias/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });
  
      if (response.ok) {
        toast.success('Asistencia guardada exitosamente.');
  
        const notificationResponse = await fetch(`${apiUrl}send_notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alumno_id: alumno.id_alumnos,
            subject: 'Notificación de Asistencia',
            message: `Hola ${alumno.nombre_alumnos}, tu estado de asistencia en la asignatura: ${selectedHorario.nombre_asignatura} de hoy es: ${attendanceStatus} \n `,
          }),
        });
  
        if (notificationResponse.ok) {
          toast.success('Notificación enviada exitosamente.');
        } else {
          const errorData = await notificationResponse.json();
          toast.error(errorData.message || 'Error al enviar la notificación.');
        }
  
        if (currentAlumnoIndex < alumnos.length - 1) {
          setCurrentAlumnoIndex(currentAlumnoIndex + 1);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al guardar la asistencia.');
      }
    } catch {
      toast.error('Error al guardar la asistencia.');
    }
  };

  const generatePdf = async () => {
    if (!selectedHorario) {
      toast.error('No se ha seleccionado un horario.');
      return;
    }
  
    const doc = new jsPDF();
    const tableColumn = [
      'Nombre Completo',
      'Número de Control',
      'Asistencia',
      'Comentario',
    ];
    const tableRows: string[][] = [];
  
    alumnos.forEach((alumno) => {
      const attendanceRecord = attendance[alumno.id_alumnos];
      const attendanceStatus = attendanceRecord && attendanceRecord.attended ? 'Asistió' : 'No asistió';
      const comment = attendanceRecord ? attendanceRecord.comment : '';
      const alumnoData = [
        `${alumno.nombre_alumnos} ${alumno.app_alumnos} ${alumno.apm_alumnos}`,
        alumno.nocontrol_alumnos,
        attendanceStatus,
        comment,
      ];
      tableRows.push(alumnoData);
    });
  
    const {
      nombre_asignatura,
      nombre_docente,
      nombre_grado,
      nombre_grupo,
      nombre_carrera_tecnica,
    } = selectedHorario;
  
    doc.setFillColor(0, 118, 0);
    doc.rect(0, 0, 210, 20, 'F');
  
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('INFORME DIARIO', 105, 12, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    let yOffset = 30;
    const lineSpacing = 10;
  
    doc.text(`Asignatura: ${nombre_asignatura}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Docente: ${nombre_docente}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Grado: ${nombre_grado}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Grupo: ${nombre_grupo}`, 14, yOffset);
    yOffset += lineSpacing;
    doc.text(`Carrera Técnica: ${nombre_carrera_tecnica}`, 14, yOffset);
    yOffset += lineSpacing;
  
    const date = new Date().toLocaleDateString();
    doc.text(`Fecha: ${date}`, 14, yOffset);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yOffset + 12,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 118, 0],
        textColor: [255, 255, 255],
      },
    });
  
    const pdfFileName = `reporte_asistencia_${date}.pdf`;
    doc.save(pdfFileName);
  };

  if (loading) {
    return <p className="loading-message-horario-docente">Cargando horarios del docente...</p>
  }

  if (error) {
    return <p className="error-message-horario-docente">{error}</p>
  }

  return (
    <>
      <div className="container-horario-docente">
        <ToastContainer />
        <h2>Horarios Escolares</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Asignatura</th>
              <th>Docente</th>
              <th>Grado</th>
              <th>Grupo</th>
              <th>Carrera Técnica</th>
              <th>Ciclo Escolar</th>
              <th>Días y Horarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.id_horario}>
                <td>{horario.id_horario}</td>
                <td>{horario.nombre_asignatura}</td>
                <td>{horario.nombre_docente}</td>
                <td>{horario.nombre_grado}</td>
                <td>{horario.nombre_grupo}</td>
                <td>{horario.nombre_carrera_tecnica}</td>
                <td>{horario.ciclo_escolar}</td>
                <td>
                  {horario.dias_horarios.map((dia, index) => (
                    <div key={index}>
                      {dia.day}: {dia.startTime} - {dia.endTime}
                    </div>
                  ))}
                </td>
                <td className="align2">
                  <button
                    className="save-button"
                    type="button"
                    onClick={() => openModal(horario)}
                  >
                    Ver Alumnos
                  </button>
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => openInitialModal(horario)}
                  >
                    Tomar Asistencia
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={closeHelpModal}
        className="modal-info-alumn"
        overlayClassName="modal-overlay-info-alumn"
      >
        <div className="help-modal-content">
          <button className="help-modal-close" onClick={closeHelpModal}>
            &times;
          </button>
          <h2>Ayuda </h2>
          <p>Para insertar alumnos, puede hacerlo de de esta manera:</p>
          <ul>
            <li>
              Ingresando el numero de control del alumno, darle en agregar y
              posteriormente se agregara
            </li>
          </ul>
          <p>
            En caso de que se muestre en blanco de clic
            <strong>
              en notificacion y vuelva a dar clic en Horario Escolar
            </strong>
            y ya se podra visualizar
          </p>
          <h2>Toma de Asistencia</h2>
          <p>
            de clic en el boton de <strong>Tomar Asistencia</strong>{' '}
            posteriomente debe ingresar la fecha actual
          </p>

          <p>
            Da clic en <strong>Generar PDF</strong> para guardar el INFORME DE ASISTENCIAS 
          </p>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-horarios-horario-docente"
        overlayClassName="modal-overlay-horarios-horario-docente"
      >
        <h2 className="h2">Alumnos del Horario</h2>
        {alumnos.length > 0 ? (
          <>
            <table className="alumnos-table-horario-docente">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Número de Control</th>
                </tr>
              </thead>
              <tbody>
                {currentAlumnos.map((alumno) => (
                  <tr key={alumno.id_alumnos}>
                    <td>
                      {alumno.nombre_alumnos} {alumno.app_alumnos}{' '}
                      {alumno.apm_alumnos}
                    </td>
                    <td>{alumno.nocontrol_alumnos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">{renderPageNumbers()}</div>
          </>
        ) : (
          <p>No hay alumnos por el momento</p>
        )}
        <button className="save-button" type="button" onClick={openAddModal}>
          Agregar Alumno
        </button>
        {alumnos.length > 0 && (
    <button
      className="download-button"
      type="button"
      onClick={() => generateAlumnosPdf(selectedHorario, alumnos)}
    >
      Descargar PDF alumnos del horario
    </button>
  )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        className="modal-alumn-manual"
        overlayClassName="modal-overlay-alumn-manual"
      >
        <h2>Agregar Alumno </h2>
        <div className="add-alumno-form-horario-docente">
          <label htmlFor="nocontrol">
            Ingrese el número de control del alumno
          </label>
          <input
            type="number"
            id="nocontrol"
            value={nocontrolAlumno}
            onChange={(e) => setNocontrolAlumno(e.target.value)}
          />
          <button
            className="save-button"
            type="button"
            onClick={handleAddAlumno}
          >
            Agregar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isInitialModalOpen}
        onRequestClose={closeInitialModal}
          className="modal-horarios-horario-docente"
        overlayClassName="modal-overlay-horarios-horario-docente"
      >
        <h2 className="h2">¿Listo para tomar asistencia?</h2>
        <div className="add-alumno-form-horario-docente">
          <label htmlFor="currentDate">Ingrese la fecha actual:</label>
          <input
            type="datetime-local"
            id="currentDate"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
          <button
            className="start-button"
            type="button"
            onClick={openAttendanceModal}
          >
            START
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isAttendanceModalOpen}
        onRequestClose={closeAttendanceModal}
   className="modal-horarios-horario-docente"
        overlayClassName="modal-overlay-horarios-horario-docente"
      >
        {alumnos.length > 0 && (
          <div className="attendance-form-horario-docente">
            <div className="header">
              {alumnos[currentAlumnoIndex].foto_alumnos && (
                <img
                  src={`data:image/jpeg;base64,${alumnos[currentAlumnoIndex].foto_alumnos}`}
                  alt={alumnos[currentAlumnoIndex].nombre_alumnos}
                  className="student-photo-aws-horario-docente"
                />
              )}
              <h3 className="student-name-horario-docente">
                {alumnos[currentAlumnoIndex].nombre_alumnos}{' '}
                {alumnos[currentAlumnoIndex].app_alumnos}{' '}
                {alumnos[currentAlumnoIndex].apm_alumnos}
              </h3>
            </div>
            <div className="student-info-horario-docente">
              <p>
                Carrera Técnica:{' '}
                <strong>
                  {alumnos[currentAlumnoIndex].nombre_carrera_tecnica}
                </strong>
              </p>
              <br />
              <p>
                Grado:{' '}
                <strong>{alumnos[currentAlumnoIndex].nombre_grado}</strong>{' '}
                Grupo:{' '}
                <strong>{alumnos[currentAlumnoIndex].nombre_grupo}</strong>
              </p>
              <br />
              <p>
                No. Control:{' '}
                <strong>{alumnos[currentAlumnoIndex].nocontrol_alumnos}</strong>
              </p>
              <br />
              <p>¿Asistió hoy a clases?</p>
              <div className="attendance-options-horario-docente">
                <input
                  type="radio"
                  id="attendance-yes"
                  name="attendance"
                  value="yes"
                  checked={isChecked(currentAlumnoIndex, true)}
                  onChange={() =>
                    handleAttendanceChange(currentAlumnoIndex, true)
                  }
                />
                <label htmlFor="attendance-yes">SI</label>

                <input
                  type="radio"
                  id="attendance-no"
                  name="attendance"
                  value="no"
                  checked={isChecked(currentAlumnoIndex, false)}
                  onChange={() =>
                    handleAttendanceChange(currentAlumnoIndex, false)
                  }
                />
                <label htmlFor="attendance-no">NO</label>
              </div>

              <br />
              <label htmlFor="comment">Comentario:</label>
              <input
                type="text"
                id="comment"
                value={
                  attendance[alumnos[currentAlumnoIndex].id_alumnos]?.comment ||
                  ''
                }
                onChange={(e) =>
                  handleCommentChange(currentAlumnoIndex, e.target.value)
                }
              />
            </div>
            <div className="attendance-buttons">
              <button
                type="button"
                onClick={handlePreviousAlumno}
                disabled={currentAlumnoIndex === 0}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleNextAlumno}
                disabled={currentAlumnoIndex === alumnos.length - 1}
              >
                Siguiente
              </button>
              <button type="button" onClick={handleSaveAttendance}>
                Guardar asistencia
              </button>
              <button type="button" onClick={generatePdf}>
                Generar PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default HorarioDocente
