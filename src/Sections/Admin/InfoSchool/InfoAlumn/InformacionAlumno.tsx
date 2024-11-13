import './InfoAlumn.css'
import './help.css'; 
import './modal-alumn-manual.css'
import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { apiUrl } from '../../../../constants/Api'
import Modal from 'react-modal'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DateTime } from 'luxon'
import { Alumn,ManualAddFormData,SecretQuestion,SexOption,Clinic,Grado,Grupo,Traslado,TrasladoTransporte,CarreraTecnica,Pais,Estado} from '../../../../constants/interfaces';
import ModalActualizarAlumno from './ModalActualizarAlumno'

interface FormData {
  nombre_usuario: string
  app_usuario: string
  apm_usuario: string
  fecha_nacimiento_usuario: string
  token_usuario: string
  correo_usuario: string
  pwd_usuario: string
  phone_usuario: string
  idRol: number
  idSexo: string
  ip_usuario: string
  idCuentaActivo: number
  idPregunta: string
  respuestaPregunta: string
  id_alumno: number | null // Nuevo campo para ID de alumno
 }
// Inicializar Modal
Modal.setAppElement('#root')

export default function InfoAlumn() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false)

// Añadir un nuevo estado para manejar el modal de actualización
const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
const [selectedAlumnoToUpdate, setSelectedAlumnoToUpdate] = useState<Alumn | null>(null);

// Función para abrir el modal de actualización
const openUpdateModal = (alumno: Alumn) => {
  setSelectedAlumnoToUpdate(alumno);
  setIsUpdateModalOpen(true);
};

// Función para cerrar el modal de actualización
const closeUpdateModal = () => {
  setIsUpdateModalOpen(false);
  setSelectedAlumnoToUpdate(null);
};

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };
  const [alumnos, setAlumnos] = useState<Alumn[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [alumnosPerPage] = useState<number>(7)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualAddModalOpen, setIsManualAddModalOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    nombre_usuario: '',
    app_usuario: '',
    apm_usuario: '',
    fecha_nacimiento_usuario: '',
    token_usuario: '',
    correo_usuario: '',
    pwd_usuario: '',
    phone_usuario: '',
    idRol: 2,
    idSexo: '',
    ip_usuario: '',
    idCuentaActivo: 1,
    idPregunta: '',
    respuestaPregunta: '',
    id_alumno: null,
  })
  const [manualAddFormData, setManualAddFormData] = useState<ManualAddFormData>({
    nombre_alumnos: '',
    app_alumnos: '',
    apm_alumnos: '',
    fecha_nacimiento_alumnos: '',
    curp_alumnos: '',
    nocontrol_alumnos: '',
    telefono_alumnos: '',
    seguro_social_alumnos: '',
    cuentacredencial_alumnos: '',
    idSexo: '',
    idUsuario: 2,
    idClinica: '',
    idGrado: '',
    idGrupo: '',
    idTraslado: '',
    idTrasladotransporte: '',
    idCarreraTecnica: '',
    idPais: '',
    idEstado: '',
    municipio_alumnos: '',
    comunidad_alumnos: '',
    calle_alumnos: '',
    proc_sec_alumno: '',
    nombre_completo_familiar: '',
    telefono_familiar : '',
    telefono_trabajo_familiar : '',
    correo_familiar : '',
  })
  const [manualAddStep, setManualAddStep] = useState<number>(1)
  const [secretQuestions, setSecretQuestions] = useState<SecretQuestion[]>([])
  const [sexOptions, setSexOptions] = useState<SexOption[]>([])
  const [clinicOptions, setClinicOptions] = useState<Clinic[]>([])
  const [gradoOptions, setGradoOptions] = useState<Grado[]>([])
  const [grupoOptions, setGrupoOptions] = useState<Grupo[]>([])
  const [trasladoOptions, setTrasladoOptions] = useState<Traslado[]>([])
  const [trasladoTransporteOptions, setTrasladoTransporteOptions] = useState<TrasladoTransporte[]>([])
  const [carreraTecnicaOptions, setCarreraTecnicaOptions] = useState<CarreraTecnica[]>([])
  const [paisOptions, setPaisOptions] = useState<Pais[]>([])
  const [estadoOptions, setEstadoOptions] = useState<Estado[]>([])
  const [step, setStep] = useState<number>(1)
  const [captchaValido, cambiarEstado] = useState<boolean | null>(null)
  const captcha = useRef<ReCAPTCHA>(null)
  const [selectedAlumno, setSelectedAlumno] = useState<Alumn | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  


  useEffect(() => {
   fetchData();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
 
 const fetchData = async () => {
   try {
     await fetchAlumnos(); // Llamar a esta función para obtener los alumnos.
     const [
       secretQuestionsResponse,
       sexOptionsResponse,
       clinicOptionsResponse,
       gradoOptionsResponse,
       grupoOptionsResponse,
       trasladoOptionsResponse,
       trasladoTransporteOptionsResponse,
       carreraTecnicaOptionsResponse,
       paisOptionsResponse,
       estadoOptionsResponse,
     ] = await Promise.all([
       fetch(`${apiUrl}pregunta`),
       fetch(`${apiUrl}sexo`),
       fetch(`${apiUrl}clinica`),
       fetch(`${apiUrl}grado`),
       fetch(`${apiUrl}grupo`),
       fetch(`${apiUrl}traslado`),
       fetch(`${apiUrl}traslado_transporte`),
       fetch(`${apiUrl}carreras/tecnicas`),
       fetch(`${apiUrl}paises`),
       fetch(`${apiUrl}estados`),
     ]);
 
     const data = await Promise.all([
       secretQuestionsResponse.json(),
       sexOptionsResponse.json(),
       clinicOptionsResponse.json(),
       gradoOptionsResponse.json(),
       grupoOptionsResponse.json(),
       trasladoOptionsResponse.json(),
       trasladoTransporteOptionsResponse.json(),
       carreraTecnicaOptionsResponse.json(),
       paisOptionsResponse.json(),
       estadoOptionsResponse.json(),
     ]);
 
     setSecretQuestions(data[0]);
     setSexOptions(data[1]);
     setClinicOptions(data[2]);
     setGradoOptions(data[3]);
     setGrupoOptions(data[4]);
     setTrasladoOptions(data[5]);
     setTrasladoTransporteOptions(data[6]);
     setCarreraTecnicaOptions(data[7].carreras);
     setPaisOptions(data[8].paises);
     setEstadoOptions(data[9].estados);
   } catch (error) {
     console.error('Error al obtener los datos:', error);
     toast.error('Error al obtener los datos, por favor intente más tarde.');
   }
 };
 

  const openModal = (alumno: Alumn) => {
    setFormData({
      ...formData,
      nombre_usuario: alumno.nombre_alumnos,
      app_usuario: alumno.app_alumnos,
      apm_usuario: alumno.apm_alumnos,
      fecha_nacimiento_usuario: alumno.fecha_nacimiento_alumnos,
      phone_usuario: alumno.telefono_alumnos,
      id_alumno: alumno.id_alumnos,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      nombre_usuario: '',
      app_usuario: '',
      apm_usuario: '',
      fecha_nacimiento_usuario: '',
      token_usuario: '',
      correo_usuario: '',
      pwd_usuario: '',
      phone_usuario: '',
      idRol: 2,
      idSexo: '',
      ip_usuario: '',
      idCuentaActivo: 1,
      idPregunta: '',
      respuestaPregunta: '',
      id_alumno: null,
    })
    setStep(1)
  }



  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const openManualAddModal = () => {
    setIsManualAddModalOpen(true)
  }

  const closeManualAddModal = () => {
    setIsManualAddModalOpen(false)
    setManualAddFormData({
      nombre_alumnos: '',
      app_alumnos: '',
      apm_alumnos: '',
      fecha_nacimiento_alumnos: '',
      curp_alumnos: '',
      nocontrol_alumnos: '',
      telefono_alumnos: '',
      seguro_social_alumnos: '',
      cuentacredencial_alumnos: '',
      idSexo: '',
      idUsuario: 2,
      idClinica: '',
      idGrado: '',
      idGrupo: '',
      idTraslado: '',
      idTrasladotransporte: '',
      idCarreraTecnica: '',
      idPais: '',
      idEstado: '',
      municipio_alumnos: '',
      comunidad_alumnos: '',
      calle_alumnos: '',
      proc_sec_alumno: '',
      nombre_completo_familiar: '',
      telefono_familiar : '',
      telefono_trabajo_familiar : '',
      correo_familiar : '',
    })
    setManualAddStep(1)
  }

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Establecer el valor en el estado antes de la validación
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  
    if (name === 'correo_usuario' && isValidEmail(value)) {
      await checkEmailAvailability(value);
    } else if (name === 'pwd_usuario') {
      validatePassword(value);
    }
  };
  
  // Función para validar el formato de correo
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  


  const handleManualAddInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setManualAddFormData({ ...manualAddFormData, [name]: value })
  }

  const handleInsert = async (e: FormEvent) => {
    e.preventDefault()
    if (!captchaValido) {
      toast.error('Por favor, completa correctamente el CAPTCHA.')
      return
    }

    try {
      const response = await fetch(`${apiUrl}usuario/alumno/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          token_usuario: generateToken(),
          ip_usuario: await fetch('https://api64.ipify.org?format=json')
            .then((response) => response.json())
            .then((data) => data.ip),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al insertar usuario')
      }

      const newUser = await response.json()
      if (formData.id_alumno !== null) {
        await fetch(`${apiUrl}alumno/${formData.id_alumno}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idUsuario: newUser.idUsuario,
          }),
        })
      }

      toast.success('Usuario registrado exitosamente')
      closeModal()
    } catch (err) {
      let errorMessage = 'Error desconocido'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      toast.error(`Error al registrar usuario: ${errorMessage}`)
    }
  }

  // Crear una función separada para obtener los alumnos
const fetchAlumnos = async () => {
 try {
   const response = await fetch(`${apiUrl}alumno`);
   if (!response.ok) {
     throw new Error('Error al obtener los alumnos');
   }
   const data = await response.json();
   setAlumnos(data);
 } catch (error) {
   console.error('Error al obtener los alumnos:', error);
   toast.error('Error al obtener los alumnos desde el servidor.');
 }
};

  const handleManualAdd = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}alumno/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualAddFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al insertar alumno')
      }

      toast.success('Alumno agregado exitosamente')
      closeManualAddModal()
      await fetchAlumnos(); // Refrescar la lista de alumnos después de la inserción
    } catch (err) {
      let errorMessage = 'Error desconocido'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      toast.error(`Error al agregar alumno: ${errorMessage}`)
    }
  }


  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_usuario: email }),
      })
      const data = await response.json()
      if (data.exists) {
        toast.error('El correo ya existe, use otro correo')
        setFormData((prevState) => ({ ...prevState, correo_usuario: '' }))
      } else {
        toast.success('Correo disponible')
      }
    } catch {
      toast.error('Error al verificar el correo')
    }
  }

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'El password debe tener al menos 8 caracteres, incluir letras mayúsculas, minúsculas, números y caracteres especiales, y no debe contener espacios'
      );
    } else {
      toast.success('Contraseña válida');
    }
  };
  

  const onChangeCaptcha = () => {
    if (captcha.current && captcha.current.getValue()) {
      cambiarEstado(true)
    } else {
      cambiarEstado(false)
    }
  }

  const generateToken = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    const getRandomChar = (source: string) =>
      source.charAt(Math.floor(Math.random() * source.length))

    return (
      getRandomChar(letters) +
      getRandomChar(letters) +
      getRandomChar(letters) +
      getRandomChar(numbers) +
      getRandomChar(numbers) +
      getRandomChar(numbers) +
      getRandomChar(letters) +
      getRandomChar(numbers)
    )
  }

  const handleNextStep = () => {
    if (step === 1) {
      const birthDate = DateTime.fromISO(formData.fecha_nacimiento_usuario)
      const currentDate = DateTime.now()
      const age = currentDate.diff(birthDate, 'years').years

      if (age < 15 || age > 19) {
        toast.info('La edad debe estar entre 15 y 19 años.')
        return
      }
    }
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleNextManualAddStep = () => {
    setManualAddStep(manualAddStep + 1)
  }

  const handlePreviousManualAddStep = () => {
    setManualAddStep(manualAddStep - 1)
  }

 


  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${apiUrl}alumno/upload_csv`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al subir el archivo CSV');
        }

        toast.success('Archivo CSV subido exitosamente');
        setIsCsvModalOpen(false);
        fetchAlumnos(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
          toast.error(`Error al subir el archivo CSV: ${error.message}`);
      } else {
          toast.error('Error al subir el archivo CSV: Error desconocido');
      }
  }
};

  const openCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
  };

  // Obtener alumnos de la página actual
  const indexOfLastAlumno = currentPage * alumnosPerPage
  const indexOfFirstAlumno = indexOfLastAlumno - alumnosPerPage
  const currentAlumnos = alumnos.slice(indexOfFirstAlumno, indexOfLastAlumno)

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const openInfoModal = (alumno: Alumn) => {
    setSelectedAlumno(alumno); // Almacena el alumno seleccionado
    setIsInfoModalOpen(true); // Abre el modal
  };
  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedAlumno(null); // Limpia el alumno seleccionado
  };

  
  
  return (
    <div className="info-alumn-admin-container">
      <h2>Lista de Alumnos</h2>
  
      <button className="add-button" onClick={openAddModal}>
        Agregar Alumnos
      </button>

      <ToastContainer />
      {alumnos.length === 0 ? (
        <p>No hay alumnos disponibles.</p>
      ) : (
        <>
          <table className="info-alumn-admin-table">
            <thead >
              <tr >
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Fecha de Nacimiento</th>
                <th>NO Control</th>
                <th>CURP</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody >
              {currentAlumnos.map((alumno) => (
                <tr key={alumno.id_alumnos}>
                  <td>{alumno.nombre_alumnos}</td>
                  <td>{alumno.app_alumnos}</td>
                  <td>{alumno.apm_alumnos}</td>
                  <td>{alumno.fecha_nacimiento_alumnos}</td>
                  <td>{alumno.nocontrol_alumnos}</td>
                  <td>{alumno.curp_alumnos}</td>
                  <td>{alumno.telefono_alumnos}</td>
                  <td>
                    <button
                      className="save-button-info-alumn-admin"
                      type="button"
                      onClick={() => openModal(alumno)}
                    >
                      Crear Usuario
                    </button>

                    <button
                      className="save-button-info-alumn-admin"
                      type="button"
                      onClick={() => openUpdateModal(alumno)}
                    >
                      Actualizar
                    </button>
                    
                    <button
    className="info-button-info-alumn-admin"
    type="button"
    onClick={() => openInfoModal(alumno)} // Función para abrir modal de info
  >
    Info
  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-info-alumn-admin">
            {Array.from({ length: Math.ceil(alumnos.length / alumnosPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-info-alumn-admin"
        overlayClassName="modal-overlay-info-alumn-admin"
      >
        <h2>Registro de Usuario</h2>
        <form className="modal-form-info-alumn-admin" onSubmit={handleInsert}>
          {step === 1 && (
            <div className="register-section-info-alumn-admin">
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="nombre_usuario">Nombre</label>
                <input
                  type="text"
                  id="nombre_usuario"
                  name="nombre_usuario"
                  placeholder="Nombre"
                  value={formData.nombre_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="app_usuario">Apellido Paterno</label>
                <input
                  type="text"
                  id="app_usuario"
                  name="app_usuario"
                  placeholder="Apellido Paterno"
                  value={formData.app_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="apm_usuario">Apellido Materno</label>
                <input
                  type="text"
                  id="apm_usuario"
                  name="apm_usuario"
                  placeholder="Apellido Materno"
                  value={formData.apm_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="fecha_nacimiento_usuario">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento_usuario"
                  name="fecha_nacimiento_usuario"
                  placeholder="Fecha de Nacimiento"
                  value={formData.fecha_nacimiento_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="button-group-info-alumn-admin">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-button-info-alumn-admin"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="next-button-info-alumn-admin"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="register-section-info-alumn-admin">
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="correo_usuario">Correo</label>
                <input
                  type="text"
                  id="correo_usuario"
                  name="correo_usuario"
                  placeholder="Correo"
                  value={formData.correo_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="pwd_usuario">Contraseña</label>
                <input
    type="password"
    id="pwd_usuario"
    name="pwd_usuario"
    placeholder="Contraseña"
    value={formData.pwd_usuario}
    onChange={(e) => setFormData({ ...formData, pwd_usuario: e.target.value })}
    onBlur={(e) => validatePassword(e.target.value)}
    required
  />
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="phone_usuario">Teléfono</label>
                <input
                  type="tel"
                  id="phone_usuario"
                  name="phone_usuario"
                  placeholder="Teléfono"
                  value={formData.phone_usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="button-group-info-alumn-admin">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="previous-button-info-alumn-admin"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="next-button-info-alumn-admin"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="register-section-info-alumn-admin">
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="idSexo">Sexo</label>
                <select
                  id="idSexo"
                  name="idSexo"
                  value={formData.idSexo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {sexOptions.map((sexo) => (
                    <option key={sexo.id_sexos} value={sexo.id_sexos}>
                      {sexo.nombre_sexo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="idPregunta">Pregunta Secreta</label>
                <select
                  id="idPregunta"
                  name="idPregunta"
                  value={formData.idPregunta}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una pregunta...</option>
                  {secretQuestions.map((pregunta) => (
                    <option
                      key={pregunta.id_preguntas}
                      value={pregunta.id_preguntas}
                    >
                      {pregunta.nombre_preguntas}
                    </option>
                  ))}
                </select>
              </div>
              <div className="register-input-container-info-alumn-admin">
                <label htmlFor="respuestaPregunta">Respuesta Secreta</label>
                <input
                  type="text"
                  id="respuestaPregunta"
                  name="respuestaPregunta"
                  placeholder="Respuesta Secreta"
                  value={formData.respuestaPregunta}
                  onChange={handleInputChange}
                  required
                />
              </div>

              
              <div className="recaptcha-info-alumn">
                <ReCAPTCHA
                  ref={captcha}
                  sitekey="6LdYfJspAAAAAAxTWQY68WAEX6JTgnysv3NxAMzd"
                  onChange={onChangeCaptcha}
                />
              </div>
              <div className="button-group-info-alumn-admin">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="previous-button-info-alumn-admin"
                >
                  Anterior
                </button>
                <button type="submit" className="save-button-info-alumn-admin">
                  Guardar
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>

      <ModalActualizarAlumno
  isOpen={isUpdateModalOpen}
  onRequestClose={closeUpdateModal}
  alumno={selectedAlumnoToUpdate}
/>


      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        className="modal-info-alumn-admin"
        overlayClassName="modal-overlay-info-alumn-admin"
      >
        <h2>Agregar Alumnos</h2>
        <div className="button-group-info-alumn-admin">
          <button
            className="save-button-info-alumn-admin"
            type="button"
            onClick={openManualAddModal}
          >
            Agregar Manualmente
          </button>
          <button className="previous-button-info-alumn-admin" type="button" onClick={openCsvModal}>
            Agregar por CSV
          </button>
          <button
            className="cancel-button-info-alumn-admin"
            type="button"
            onClick={() => setIsAddModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isManualAddModalOpen}
        onRequestClose={closeManualAddModal}
 className="modal-alumn-manual"
  overlayClassName="modal-overlay-alumn-manual"
      >
        <h2 className="modal-alumn-manual">Agregar Alumno Manualmente</h2>
        <form onSubmit={handleManualAdd}>
          {manualAddStep === 1 && (
            <div className="form-alumn-manual" >
              <div >
                <label htmlFor="nombre_alumnos">Nombre</label>
                <input
                  type="text"
                  id="nombre_alumnos"
                  name="nombre_alumnos"
                  placeholder="Nombre"
                  value={manualAddFormData.nombre_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  title="El nombre solo puede contener letras"
                />
              </div>
              <div >
                <label htmlFor="app_alumnos">Apellido Paterno</label>
                <input
                  type="text"
                  id="app_alumnos"
                  name="app_alumnos"
                  placeholder="Apellido Paterno"
                  value={manualAddFormData.app_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  title="El apellido paterno solo puede contener letras"
                />
              </div>
              <div >
                <label htmlFor="apm_alumnos">Apellido Materno</label>
                <input
                  type="text"
                  id="apm_alumnos"
                  name="apm_alumnos"
                  placeholder="Apellido Materno"
                  value={manualAddFormData.apm_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  title="El apellido materno solo puede contener letras"
                />
              </div>
              <div >
                <label htmlFor="fecha_nacimiento_alumnos">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento_alumnos"
                  name="fecha_nacimiento_alumnos"
                  placeholder="Fecha de Nacimiento"
                  value={manualAddFormData.fecha_nacimiento_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                />
              </div>
            
              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={closeManualAddModal}
                  className="close-button-alumn-manual"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {manualAddStep === 2 && (
            <div className="form-alumn-manual">
              <div >
                <label htmlFor="curp_alumnos">CURP</label>
                <input
                  type="text"
                  id="curp_alumnos"
                  name="curp_alumnos"
                  placeholder="CURP"
                  value={manualAddFormData.curp_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="nocontrol_alumnos">Número de Control</label>
                <input
                  type="text"
                  id="nocontrol_alumnos"
                  name="nocontrol_alumnos"
                  placeholder="Número de Control"
                  value={manualAddFormData.nocontrol_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="telefono_alumnos">Teléfono</label>
                <input
                  type="tel"
                  id="telefono_alumnos"
                  name="telefono_alumnos"
                  placeholder="Teléfono"
                  value={manualAddFormData.telefono_alumnos}
                  onChange={handleManualAddInputChange}
                  required
                />
              </div>
              <div >
                <label htmlFor="seguro_social_alumnos">Seguro Social</label>
                <input
                  type="text"
                  id="seguro_social_alumnos"
                  name="seguro_social_alumnos"
                  placeholder="Seguro Social"
                  value={manualAddFormData.seguro_social_alumnos}
                  onChange={handleManualAddInputChange}
                />
              </div>
              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {manualAddStep === 3 && (
            <div className="form-alumn-manual">
              <div >
                <label htmlFor="cuentacredencial_alumnos">
                  Cuenta Credencial
                </label>
                <input
                  type="text"
                  id="cuentacredencial_alumnos"
                  name="cuentacredencial_alumnos"
                  placeholder="Cuenta Credencial"
                  value={manualAddFormData.cuentacredencial_alumnos}
                  onChange={handleManualAddInputChange}
                />
              </div>
              <div >
                <label htmlFor="idSexo">Sexo</label>
                <select
                  id="idSexo"
                  name="idSexo"
                  value={manualAddFormData.idSexo}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {sexOptions.map((sexo) => (
                    <option key={sexo.id_sexos} value={sexo.id_sexos}>
                      {sexo.nombre_sexo}
                    </option>
                  ))}
                </select>
              </div>
              <div >
                <label htmlFor="idClinica">Clínica</label>
                <select
                  id="idClinica"
                  name="idClinica"
                  value={manualAddFormData.idClinica}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {clinicOptions.map((clinica) => (
                    <option
                      key={clinica.id_clinicas}
                      value={clinica.id_clinicas}
                    >
                      {clinica.nombre_clinicas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="idGrado">Grado</label>
                <select
                  id="idGrado"
                  name="idGrado"
                  value={manualAddFormData.idGrado}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {gradoOptions.map((grado) => (
                    <option key={grado.id_grado} value={grado.id_grado}>
                      {grado.nombre_grado}
                    </option>
                  ))}
                </select>
              </div>
            
            
              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {manualAddStep === 4 && (
            <div className="form-alumn-manual">
          
            <div >
                <label htmlFor="idGrupo">Grupo</label>
                <select
                  id="idGrupo"
                  name="idGrupo"
                  value={manualAddFormData.idGrupo}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {grupoOptions.map((grupo) => (
                    <option key={grupo.id_grupos} value={grupo.id_grupos}>
                      {grupo.nombre_grupos}
                    </option>
                  ))}
                </select>
              </div>
            <div >
                <label htmlFor="idTraslado">Traslado</label>
                <select
                  id="idTraslado"
                  name="idTraslado"
                  value={manualAddFormData.idTraslado}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {trasladoOptions.map((traslado) => (
                    <option
                      key={traslado.id_traslado}
                      value={traslado.id_traslado}
                    >
                      {traslado.nombre_traslado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="idTrasladotransporte">
                  Traslado Transporte
                </label>
                <select
                  id="idTrasladotransporte"
                  name="idTrasladotransporte"
                  value={manualAddFormData.idTrasladotransporte}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {trasladoTransporteOptions.map((traslado) => (
                    <option
                      key={traslado.id_traslado_transporte}
                      value={traslado.id_traslado_transporte}
                    >
                      {traslado.nombre_traslado_transporte}
                    </option>
                  ))}
                </select>
              </div>

              <div >
                <label htmlFor="idCarreraTecnica">Carrera Técnica</label>
                <select
                  id="idCarreraTecnica"
                  name="idCarreraTecnica"
                  value={manualAddFormData.idCarreraTecnica}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {carreraTecnicaOptions.map((carrera) => (
                    <option
                      key={carrera.id_carrera_tecnica}
                      value={carrera.id_carrera_tecnica}
                    >
                      {carrera.nombre_carrera_tecnica}
                    </option>
                  ))}
                </select>
              </div>

            

              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {manualAddStep === 5 && (
            <div className="form-alumn-manual">

<div>
              <div >
                <label htmlFor="idPais">País</label>
                <select
                  id="idPais"
                  name="idPais"
                  value={manualAddFormData.idPais}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {paisOptions.map((pais) => (
                    <option key={pais.id_pais} value={pais.id_pais}>
                      {pais.nombre_pais}
                    </option>
                  ))}
                </select>
              </div>

              <div >
                <label htmlFor="idEstado">Estado</label>
                <select
                  id="idEstado"
                  name="idEstado"
                  value={manualAddFormData.idEstado}
                  onChange={handleManualAddInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {estadoOptions.map((estado) => (
                    <option key={estado.id_estado} value={estado.id_estado}>
                      {estado.nombre_estado}
                    </option>
                  ))}
                </select>
              </div>
                <label htmlFor="municipio_alumnos">Municipio</label>
                <input
                  type="text"
                  id="municipio_alumnos"
                  name="municipio_alumnos"
                  placeholder="Municipio"
                  value={manualAddFormData.municipio_alumnos}
                  onChange={handleManualAddInputChange}
                />
              </div>
              <div >
                <label htmlFor="comunidad_alumnos">Comunidad</label>
                <input
                  type="text"
                  id="comunidad_alumnos"
                  name="comunidad_alumnos"
                  placeholder="Comunidad"
                  value={manualAddFormData.comunidad_alumnos}
                  onChange={handleManualAddInputChange}
                />
              </div>
     
 

              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

{manualAddStep === 6 && (
            <div className="form-alumn-manual">


             
             
              <div >
                <label htmlFor="calle_alumnos">Calle</label>
                <input
                  type="text"
                  id="calle_alumnos"
                  name="calle_alumnos"
                  placeholder="Calle"
                  value={manualAddFormData.calle_alumnos}
                  onChange={handleManualAddInputChange}
                />
              </div>
              <div >
                <label htmlFor="proc_sec_alumno">Procedencia Secundaria</label>
                <input
                  type="text"
                  id="proc_sec_alumno"
                  name="proc_sec_alumno"
                  placeholder="Procedencia Secundaria"
                  value={manualAddFormData.proc_sec_alumno}
                  onChange={handleManualAddInputChange}
                />
              </div>
              <div >
                <label htmlFor="nombre_completo_familiar">Nombre Completo Familiar</label>
                <input
                  type="text"
                  id="nombre_completo_familiar"
                  name="nombre_completo_familiar"
                  placeholder="nombre completo familiar"
                  value={manualAddFormData.nombre_completo_familiar}
                  onChange={handleManualAddInputChange}
                />
              </div>

              <div >
                <label htmlFor="telefono_familiar">telefono Familiar</label>
                <input
                  type="text"
                  id="telefono_familiar"
                  name="telefono_familiar"
                  placeholder="telefono familiar"
                  value={manualAddFormData.telefono_familiar}
                  onChange={handleManualAddInputChange}
                />
              </div>

       


              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextManualAddStep}
                  className="save-button-alumn-manual"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

{manualAddStep === 7 && (
            <div className="form-alumn-manual">

              <div >
                <label htmlFor="telefono_trabajo_familiar">telefono trabajo Familiar</label>
                <input
                  type="text"
                  id="telefono_trabajo_familiar"
                  name="telefono_trabajo_familiar"
                  placeholder="telefono trabajo familiar"
                  value={manualAddFormData.telefono_trabajo_familiar}
                  onChange={handleManualAddInputChange}
                />
              </div>

              <div >
                <label htmlFor="correo_familiar">correo Familiar</label>
                <input
                  type="email"
                  id="correo_familiar"
                  name="correo_familiar"
                  placeholder="correo familiar"
                  value={manualAddFormData.correo_familiar}
                  onChange={handleManualAddInputChange}
                />
              </div>

              <div className="button-group-alumn-manual">
                <button
                  type="button"
                  onClick={handlePreviousManualAddStep}
                  className="close-button-alumn-manual"
                >
                  Anterior
                </button>
                <button type="submit" className="save-button-alumn-manual">
                  Guardar
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>


      <Modal
                isOpen={isCsvModalOpen}
                onRequestClose={closeCsvModal}
                className="modal-info-alumn-admin"
                overlayClassName="modal-overlay-info-alumn-admin"
            >
                <h2>Cargar Alumnos desde CSV</h2>
                <label htmlFor="csvUpload" className="save-button-info-alumn-admin">
                    Agregar por CSV
                </label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    style={{ display: 'none' }}
                    id="csvUpload"
                />
                <button
                    className="cancel-button-info-alumn-admin"
                    type="button"
                    onClick={closeCsvModal}
                >
                    Cancelar
                </button>
            </Modal>

            <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={closeHelpModal}
        className="modal-info-alumn-admin"
        overlayClassName="modal-overlay-info-alumn-admin"
      >
        <div className="help-modal-content">
        <button className="help-modal-close" onClick={closeHelpModal}>
            &times;
          </button>
          <h2>Ayuda para la Inserción de Alumnos</h2>
          <p>
            Para insertar alumnos, puede hacerlo de dos maneras:
          </p>
          <ul>
            <li>Manual: Llenando el formulario manualmente.</li>
            <li>CSV: Subiendo un archivo CSV con los datos de los alumnos.</li>
          </ul>
    
          <p>
            Puede descargar un archivo CSV de ejemplo desde el siguiente enlace:
          </p>
          <a href={`${apiUrl}example_csv`} download="ejemplo.csv">Descargar archivo CSV de ejemplo</a>
        </div>
      </Modal>
      <Modal
  isOpen={isInfoModalOpen}
  onRequestClose={closeInfoModal}
  className="modal-info-alumn-admin"
  overlayClassName="modal-overlay-info-alumn-admin"
>
  <h2>Información Completa del Alumno</h2>
  {selectedAlumno && (
    <div className="info-alumn-admin-container">
      <p><strong>Seguro Social:</strong> {selectedAlumno.clinica || "No disponible"}: {selectedAlumno.seguro_social_alumnos || "No disponible"}</p>
      <p><strong>Correo de Usuario:</strong> {selectedAlumno.correo_usuario || "No disponible"}</p>
      <p><strong>Semestre:</strong> {selectedAlumno.grado || "No disponible"}º{selectedAlumno.grupo || "No disponible"}</p>      
      <p><strong>Carrera Técnica:</strong> {selectedAlumno.carrera_tecnica || "No disponible"}</p>
      <p><strong>Ubicación:</strong>{selectedAlumno.calle_alumnos || "No disponible"},{selectedAlumno.comunidad_alumnos || "No disponible"},{selectedAlumno.municipio_alumnos || "No disponible"}, {selectedAlumno.estado || "No disponible"}</p>
      <p><strong>Procedencia Secundaria:</strong> {selectedAlumno.proc_sec_alumno || "No disponible"}</p>
      <p><strong>Nombre Completo del Familiar:</strong> {selectedAlumno.nombre_completo_familiar || "No disponible"}</p>
      <p><strong>Telefono Familiar:</strong> {selectedAlumno.telefono_familiar || "No disponible"}</p>
      <p><strong>Telefono del lugar de donde trabaja:</strong> {selectedAlumno.telefono_trabajo_familiar || "No disponible"}</p>
      <p><strong>Correo Familiar:</strong> {selectedAlumno.correo_familiar || "No disponible"}</p>
    </div>
  )}
  <button className="cancel-button-info-alumn-admin" onClick={closeInfoModal}>
    Cerrar
  </button>
</Modal>



      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
    </div>
  )
}
