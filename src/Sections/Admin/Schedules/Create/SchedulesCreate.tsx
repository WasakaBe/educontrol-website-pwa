import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './SchedulesCreate.css';
import { apiUrl } from '../../../../constants/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grupo } from '../../../../constants/interfaces';
import Modal from 'react-modal'
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


interface Carrera {
  id_carrera_tecnica: number;
  nombre_carrera_tecnica: string;
}

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
}

interface ExistingSchedule {
  id_grado: number;
  id_grupo: number;
  id_carrera_tecnica: number;
  ciclo_escolar: string;
  dias_horarios: ScheduleDay[];
  id_docente: number;
}

const SchedulesCreate: React.FC = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false)


  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };


  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [asignatura, setAsignatura] = useState<string>('');
  const [docente, setDocente] = useState<string>('');
  const [grado, setGrado] = useState<string>('');
  const [grupo, setGrupo] = useState<string>('');
  const [carrera, setCarrera] = useState<string>('');
  const [ciclo, setCiclo] = useState<string>('');
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [asignaturaRes, docenteRes, gradoRes, grupoRes, carreraRes] = await Promise.all([
          fetch(`${apiUrl}asignatura`),
          fetch(`${apiUrl}docente`),
          fetch(`${apiUrl}grado`),
          fetch(`${apiUrl}grupo`),
          fetch(`${apiUrl}carreras/tecnicas`)
        ]);

        if (!asignaturaRes.ok || !docenteRes.ok || !gradoRes.ok || !grupoRes.ok || !carreraRes.ok) {
          throw new Error('Error fetching data');
        }

        const [asignaturaData, docenteData, gradoData, grupoData, carreraData] = await Promise.all([
          asignaturaRes.json(),
          docenteRes.json(),
          gradoRes.json(),
          grupoRes.json(),
          carreraRes.json()
        ]);

        setAsignaturas(asignaturaData.asignaturas || []);
        setDocentes(docenteData || []);
        setGrados(gradoData || []);
        setGrupos(grupoData || []);
        setCarreras(carreraData.carreras || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error fetching data: ${error.message}`);
        } else {
          toast.error('Unknown error occurred while fetching data.');
        }
      }
    };

    fetchData();
  }, []);

  const handleScheduleDayChange = (index: number, field: keyof ScheduleDay, value: string) => {
    const convertTimeToDecimal = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };

    const startLimit = convertTimeToDecimal('07:00');
    const endLimit = convertTimeToDecimal('16:00');

    if (field === 'startTime' || field === 'endTime') {
      const timeDecimal = convertTimeToDecimal(value);
      if (timeDecimal < startLimit || timeDecimal > endLimit) {
        toast.error('La hora debe estar entre las 7:00 AM y las 4:00 PM.');
        return;
      }
    }

    const newScheduleDays = [...scheduleDays];
    newScheduleDays[index][field] = value;
    setScheduleDays(newScheduleDays);
  };

  const handleAddScheduleDay = () => {
    const newScheduleDay: ScheduleDay = { day: '', startTime: '', endTime: '' };
    setScheduleDays([...scheduleDays, newScheduleDay]);
  };

  const handleRemoveScheduleDay = (index: number) => {
    const newScheduleDays = [...scheduleDays];
    newScheduleDays.splice(index, 1);
    setScheduleDays(newScheduleDays);
  };

  const handleInsertHorario = async (event: FormEvent) => {
    event.preventDefault();

    if (scheduleDays.length === 0) {
        toast.warning('Te falto agregar los días y horas de clases.');
        return;
    }

    try {
        const existingSchedulesResponse = await fetch(`${apiUrl}horarios_escolares`);
        if (!existingSchedulesResponse.ok) {
            throw new Error('Failed to fetch existing schedules');
        }
        const existingSchedules: ExistingSchedule[] = await existingSchedulesResponse.json();

        const conflict = scheduleDays.some(newDay => {
            return existingSchedules.some(existingSchedule => {
                if (
                    existingSchedule.id_grado === parseInt(grado) &&
                    existingSchedule.id_grupo === parseInt(grupo) &&
                    existingSchedule.id_carrera_tecnica === parseInt(carrera) &&
                    existingSchedule.ciclo_escolar === ciclo &&
                    existingSchedule.dias_horarios.some(existingDay =>
                        existingDay.day === newDay.day &&
                        existingDay.startTime === newDay.startTime &&
                        existingDay.endTime === newDay.endTime
                    )
                ) {
                    return true;
                }
                return false;
            });
        });

        if (conflict) {
            toast.error('Error al crear el horario: Conflicto de horario: otro horario ocupa este slot.');
            return;
        }

        const datosRegistro = {
            id_asignatura: parseInt(asignatura),
            id_docente: parseInt(docente),
            id_grado: parseInt(grado),
            id_grupo: parseInt(grupo),
            id_carrera_tecnica: parseInt(carrera),
            ciclo_escolar: ciclo,
            dias_horarios: scheduleDays.map(day => ({
                day: day.day,
                startTime: day.startTime,
                endTime: day.endTime
            }))
        };

        const response = await fetch(`${apiUrl}horarios_escolares/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRegistro)
        });

        const data = await response.json();
        if (!response.ok) {
            toast.error(`Error al crear el horario: ${data.error || 'Conflicto o error del servidor'}`);
            return;
        }

        toast.success('Nuevo horario creado exitosamente!');
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(`Error de conexión: ${error.message}`);
        } else {
            toast.error('Error de conexión desconocido.');
        }
    }
};


  return (
    <div className="schedule-create-container">
      <h2>Crear Horario Escolar</h2>
      <form onSubmit={handleInsertHorario} className="schedule-form">
        <div className="form-group">
          <label>Asignatura</label>
          <select value={asignatura} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAsignatura(e.target.value)}>
            <option value="">Seleccione Asignatura</option>
            {asignaturas.map(asignatura => (
              <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
                {asignatura.nombre_asignatura}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Docente</label>
          <select value={docente} onChange={(e: ChangeEvent<HTMLSelectElement>) => setDocente(e.target.value)}>
            <option value="">Seleccione Docente</option>
            {docentes.map(docente => (
              <option key={docente.id_docentes} value={docente.id_docentes}>
                {docente.nombre_docentes} {docente.app_docentes} {docente.apm_docentes}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Grado</label>
          <select value={grado} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGrado(e.target.value)}>
            <option value="">Seleccione Grado</option>
            {grados.map(grado => (
              <option key={grado.id_grado} value={grado.id_grado}>
                {grado.nombre_grado}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Grupo</label>
          <select value={grupo} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGrupo(e.target.value)}>
            <option value="">Seleccione Grupo</option>
            {grupos.map(grupo => (
              <option key={grupo.id_grupos} value={grupo.id_grupos}>
                {grupo.nombre_grupos}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Carrera Técnica</label>
          <select value={carrera} onChange={(e: ChangeEvent<HTMLSelectElement>) => setCarrera(e.target.value)}>
            <option value="">Seleccione Carrera Técnica</option>
            {carreras.map(carrera => (
              <option key={carrera.id_carrera_tecnica} value={carrera.id_carrera_tecnica}>
                {carrera.nombre_carrera_tecnica}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Ciclo Escolar</label>
          <input placeholder="Ciclo Escolar" value={ciclo} onChange={(e: ChangeEvent<HTMLInputElement>) => setCiclo(e.target.value)} name="cicloEscolar" required />
        </div>
        {scheduleDays.map((schedule, index) => (
          <div key={index} className="schedule-day">
            <select value={schedule.day} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleScheduleDayChange(index, 'day', e.target.value)}>
              <option value="">Seleccione el día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
            <input type="time" value={schedule.startTime} onChange={(e: ChangeEvent<HTMLInputElement>) => handleScheduleDayChange(index, 'startTime', e.target.value)} />
            <input type="time" value={schedule.endTime} onChange={(e: ChangeEvent<HTMLInputElement>) => handleScheduleDayChange(index, 'endTime', e.target.value)} />
            <button type="button" onClick={() => handleRemoveScheduleDay(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={handleAddScheduleDay}>Agregar Día y Horario</button>
        <button type="submit" className="submit-button">Crear Horario</button>
      </form>
      <ToastContainer />

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
          <h2>Ayuda para la Creacion de Horario Escolar</h2>
          <p>
            Para crear, debes hacerlo de esta manera:
          </p>
          
          <p>
            <strong>Debes seleccionar los campos de seleccion que corresponde a cada campo</strong>
          </p>
          <p>
            <strong>RECUERDA QUE NO SE DEBE REPETIR EN LOS DIAS Y HORAS, NO DEBE DE REPERTIRSE LOS DIAS Y HORAS DE LAS CLASES.</strong>
          </p>
        
        <p>En caso de que no se les permita crear , debe checar que no alla otro horario con los mismos datos del <strong>DIA-HORA</strong>
          </p>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
    </div>
  );
};

export default SchedulesCreate;
