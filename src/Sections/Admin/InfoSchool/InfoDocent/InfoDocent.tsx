import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import './InfoDocent.css';
import { apiUrl } from '../../../../constants/Api';
import Modal from 'react-modal';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from 'luxon';
import { SecretQuestion,SexOption } from '../../../../constants/interfaces';
interface Docente {
  id_docentes: number;
  nombre_docentes: string;
  app_docentes: string;
  apm_docentes: string;
  fecha_nacimiento_docentes: string;
  noconttrol_docentes: string;
  telefono_docentes: string;
  idUsuario: string;
  idClinica: string;
  idSexo: string;
}

interface FormData {
  nombre_usuario: string;
  app_usuario: string;
  apm_usuario: string;
  fecha_nacimiento_usuario: string;
  token_usuario: string;
  correo_usuario: string;
  pwd_usuario: string;
  phone_usuario: string;
  idRol: number;
  idSexo: string;
  ip_usuario: string;
  idCuentaActivo: number;
  idPregunta: string;
  respuestaPregunta: string;
  id_docente: number | null;
}

interface UpdateFormData {
  nombre_docentes: string;
  app_docentes: string;
  apm_docentes: string;
  fecha_nacimiento_docentes: string;
  noconttrol_docentes: string;
  telefono_docentes: string;
  seguro_social_docentes: string;
  idSexo: string;
  idUsuario: string;
  idClinica: string;
}


Modal.setAppElement('#root');
export default function InfoDocent() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false)

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };


  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre_usuario: '',
    app_usuario: '',
    apm_usuario: '',
    fecha_nacimiento_usuario: '',
    token_usuario: '',
    correo_usuario: '',
    pwd_usuario: '',
    phone_usuario: '',
    idRol: 3,
    idSexo: '',
    ip_usuario: '',
    idCuentaActivo: 1,
    idPregunta: '',
    respuestaPregunta: '',
    id_docente: null,
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    nombre_docentes: '',
    app_docentes: '',
    apm_docentes: '',
    fecha_nacimiento_docentes: '',
    noconttrol_docentes: '',
    telefono_docentes: '',
    seguro_social_docentes: '',
    idSexo: '',
    idUsuario: '3',
    idClinica: ''
  });
  const [secretQuestions, setSecretQuestions] = useState<SecretQuestion[]>([]);
  const [sexOptions, setSexOptions] = useState<SexOption[]>([]);
  const [updateStep, setUpdateStep] = useState<number>(1);
  const [step, setStep] = useState<number>(1);
  const [captchaValido, cambiarEstado] = useState<boolean | null>(null);
  const captcha = useRef<ReCAPTCHA>(null);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchDocentes();
    fetchSecretQuestions();
    fetchSexOptions();
  }, []);

  const fetchDocentes = async () => {
    try {
      const response = await fetch(`${apiUrl}docente`);
      const data = await response.json();
      setDocentes(data);
    } catch  {
      toast.error('Error al obtener los docentes');
    }
  };

  const fetchSecretQuestions = async () => {
    try {
      const response = await fetch(`${apiUrl}pregunta`);
      const data = await response.json();
      setSecretQuestions(data);
    } catch {
      toast.error('Error al obtener las preguntas secretas');
    }
  };

  const fetchSexOptions = async () => {
    try {
      const response = await fetch(`${apiUrl}sexo`);
      const data = await response.json();
      setSexOptions(data);
    } catch  {
      toast.error('Error al obtener las opciones de sexo');
    }
  };

 

  const resetSearch = () => {
    setSearchTerm('');
    fetchDocentes();
  };

  const openModal = (docente: Docente) => {
    setFormData({
      ...formData,
      nombre_usuario: docente.nombre_docentes,
      app_usuario: docente.app_docentes,
      apm_usuario: docente.apm_docentes,
      fecha_nacimiento_usuario: docente.fecha_nacimiento_docentes,
      phone_usuario: docente.telefono_docentes,
      id_docente: docente.id_docentes,
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (docente: Docente) => {
    setUpdateFormData({
      nombre_docentes: docente.nombre_docentes,
      app_docentes: docente.app_docentes,
      apm_docentes: docente.apm_docentes,
      fecha_nacimiento_docentes: docente.fecha_nacimiento_docentes,
      noconttrol_docentes: docente.noconttrol_docentes,
      telefono_docentes: docente.telefono_docentes,
      seguro_social_docentes: '',
      idSexo: docente.idSexo,
      idUsuario: '3',
      idClinica: docente.idClinica
    });
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      nombre_usuario: '',
      app_usuario: '',
      apm_usuario: '',
      fecha_nacimiento_usuario: '',
      token_usuario: '',
      correo_usuario: '',
      pwd_usuario: '',
      phone_usuario: '',
      idRol: 3,
      idSexo: '',
      ip_usuario: '',
      idCuentaActivo: 1,
      idPregunta: '',
      respuestaPregunta: '',
      id_docente: null,
    });
    setStep(1);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateStep(1);
  };

  const openCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
  };


  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Solo verifica la disponibilidad si el correo es válido
    setFormData((formData)=>({ ...formData, [name]: value }));
    if (name === 'correo_usuario' && isValidEmail(value)) {
      await checkEmailAvailability(value);
    } else if (name === 'pwd_usuario') {
      validatePassword(value);
    }
  
   
  };
  
  

  const handleUpdateInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const handleInsert = async (e: FormEvent) => {
    e.preventDefault();
    if (!captchaValido) {
      toast.error('Por favor, completa correctamente el CAPTCHA.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}usuario/docentes/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          token_usuario: generateToken(),
          ip_usuario: await fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al insertar usuario');
      }

      const newUser = await response.json();
      if (formData.id_docente !== null) {
        await fetch(`${apiUrl}docente/${formData.id_docente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idUsuario: newUser.idUsuario,
          }),
        });
      }
    
      toast.success('Usuario registrado exitosamente');
      closeModal();
    } catch (err) {
      let errorMessage = 'Error desconocido';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      toast.error(`Error al registrar usuario: ${errorMessage}`);
    }
    };
    
    const handleUpdate = async (e: FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(`${apiUrl}docente/${updateFormData.idUsuario}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateFormData),
        });
        if (!response.ok) {
          throw new Error('Error al actualizar docente');
        }
        toast.success('Docente actualizado exitosamente');
        closeUpdateModal();
        fetchDocentes(); // Refrescar la lista de docentes después de la actualización
      } catch{
        toast.error('Error al actualizar docente');
      }
    };
    const checkEmailAvailability = async (email: string) => {
      try {
        const response = await fetch(`${apiUrl}check-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo_usuario: email }),
        });
        const data = await response.json();
        if (data.exists) {
          toast.error('El correo ya existe, use otro correo');
          setFormData(prevState => ({ ...prevState, correo_usuario: '' }));
        } else {
          toast.success('Correo disponible');
        }
      } catch {
        toast.error('Error al verificar el correo');
      }
    };
    
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
        cambiarEstado(true);
      } else {
        cambiarEstado(false);
      }
    };
    
    const generateToken = () => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
    
      const getRandomChar = (source: string) =>
        source.charAt(Math.floor(Math.random() * source.length));
    
      return getRandomChar(letters) +
        getRandomChar(letters) +
        getRandomChar(letters) +
        getRandomChar(numbers) +
        getRandomChar(numbers) +
        getRandomChar(numbers) +
        getRandomChar(letters) +
        getRandomChar(numbers);
    };
    
    const handleNextStep = () => {
      if (step === 1) {
        const birthDate = DateTime.fromISO(formData.fecha_nacimiento_usuario);
        const currentDate = DateTime.now();
        const age = currentDate.diff(birthDate, 'years').years;
    
        if (age < 18 || age > 69) {
          toast.info('La edad debe estar entre 18 y 69 años.');
          return;
        }
      }
      setStep(step + 1);
    };
    
    const handlePreviousStep = () => {
      setStep(step - 1);
    };
    
    const handleNextUpdateStep = () => {
      setUpdateStep(updateStep + 1);
    };
    
    const handlePreviousUpdateStep = () => {
      setUpdateStep(updateStep - 1);
    };
    
    const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      const formData = new FormData();
      formData.append('file', file);
    
      try {
        const response = await fetch(`${apiUrl}docente/upload_csv`, {
          method: 'POST',
          body: formData,
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al subir el archivo CSV');
        }
    
        toast.success('Archivo CSV subido exitosamente');
        setIsCsvModalOpen(false);
        fetchDocentes(); 
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error al subir el archivo CSV: ${error.message}`);
        } else {
          toast.error('Error al subir el archivo CSV: Error desconocido');
        }
      }
    };
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = docentes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(docentes.length / itemsPerPage);
    
    const handleSearchTermChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (e.target.value.trim() === '') {
        fetchDocentes();
      } else {
        try {
          const response = await fetch(`${apiUrl}docentes/nocontrol/${e.target.value}`);
          const data = await response.json();
          setDocentes([data]);
        } catch  {
          toast.error('Docente no encontrado');
        }
      }
    };
    
    return (
      <div className="info-docent-admin-container ">
        <h2>Información de Docentes</h2>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Ingrese número de control o CURP"
          />
          <button onClick={resetSearch}>Restablecer</button>
        </div>
        <button className="add-button-info-docent-admin" onClick={openCsvModal}>
          Agregar Docentes
        </button>
        <ToastContainer />
        {docentes.length === 0 ? (
          <p>No hay docentes disponibles.</p>
        ) : (
          <>
            <table className="info-docent-admin-table">
              <thead >
                <tr >
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Fecha de Nacimiento</th>
                  <th >Número de Control</th>
                  <th >Teléfono</th>
                  <th >Correo</th>
                  <th >Clínica</th>
                  <th >Sexo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(docente => (
                  <tr key={docente.id_docentes}>
                    <td>{docente.id_docentes}</td>
                    <td>{docente.nombre_docentes}</td>
                    <td>{docente.app_docentes}</td>
                    <td>{docente.apm_docentes}</td>
                    <td>{docente.fecha_nacimiento_docentes}</td>
                    <td >{docente.noconttrol_docentes}</td>
                    <td >{docente.telefono_docentes}</td>
                    <td >{docente.idUsuario}</td>
                    <td >{docente.idClinica}</td>
                    <td >{docente.idSexo}</td>
                    <td className="align2">
                      <button className="update-button-info-docent-admin" type="button" onClick={() => openUpdateModal(docente)}>
                        Actualizar
                      </button>
                      <button className='save-button-info-docent-admin' type="button" onClick={() => openModal(docente)}>
                        Crear Usuario
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-info-docent-admin">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
    
        <Modal
          isOpen={isUpdateModalOpen}
          onRequestClose={closeUpdateModal}
          className="modal-info-docent-admin"
          overlayClassName="modal-overlay-info-docent-admin"
        >
          <h2>Actualización de Docente</h2>
          <form className="modal-form-info-docent-admin" onSubmit={handleUpdate}>
            {updateStep === 1 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="nombre_docentes">Nombre</label>
                  <input
                    type="text"
                    id="nombre_docentes"
                    name="nombre_docentes"
                    placeholder="Nombre"
                    value={updateFormData.nombre_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="app_docentes">Apellido Paterno</label>
                  <input
                    type="text"
                    id="app_docentes"
                    name="app_docentes"
                    placeholder="Apellido Paterno"
                    value={updateFormData.app_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="apm_docentes">Apellido Materno</label>
                  <input
                    type="text"
                    id="apm_docentes"
                    name="apm_docentes"
                    placeholder="Apellido Materno"
                    value={updateFormData.apm_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={closeUpdateModal} className="cancel-button-info-docent-admin">
                    Cancelar
                  </button>
                  <button type="button" onClick={handleNextUpdateStep} className="next-button-info-docent-admin">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
    
            {updateStep === 2 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="fecha_nacimiento_docentes">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fecha_nacimiento_docentes"
                    name="fecha_nacimiento_docentes"
                    placeholder="Fecha de Nacimiento"
                    value={updateFormData.fecha_nacimiento_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="noconttrol_docentes">Número de Control</label>
                  <input
                    type="text"
                    id="noconttrol_docentes"
                    name="noconttrol_docentes"
                    placeholder="Número de Control"
                    value={updateFormData.noconttrol_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="telefono_docentes">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono_docentes"
                    name="telefono_docentes"
                    placeholder="Teléfono"
                    value={updateFormData.telefono_docentes}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="seguro_social_docentes">Seguro Social</label>
                  <input
                    type="text"
                    id="seguro_social_docentes"
                    name="seguro_social_docentes"
                    placeholder="Seguro Social"
                    value={updateFormData.seguro_social_docentes}
                    onChange={handleUpdateInputChange}
                  />
                </div>
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={handlePreviousUpdateStep} className="previous-button-info-docent-admin">
                    Anterior
                  </button>
                  <button type="button" onClick={handleNextUpdateStep} className="next-button-info-docent-admin">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
    
            {updateStep === 3 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="idSexo">Sexo</label>
                  <select
                    id="idSexo"
                    name="idSexo"
                    value={updateFormData.idSexo}
                    onChange={handleUpdateInputChange}
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
    
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="idClinica">Clínica</label>
                  <input
                    type="text"
                    id="idClinica"
                    name="idClinica"
                    placeholder="Clínica"
                    value={updateFormData.idClinica}
                    onChange={handleUpdateInputChange}
                  />
                </div>
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={handlePreviousUpdateStep} className="previous-button-info-docent-admin">
                    Anterior
                  </button>
                  <button type="submit" className="save-button-info-docent-admin">
                    Actualizar
                  </button>
                </div>
              </div>
            )}
          </form>
        </Modal>
    
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal-info-docent-admin"
          overlayClassName="modal-overlay-info-docent-admin"
        >
          <h2>Registro de Usuario</h2>
          <form className="modal-form-info-docent-admin" onSubmit={handleInsert}>
            {step === 1 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
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
                <div className="register-input-container-info-docent-admin">
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
                <div className="register-input-container-info-docent-admin">
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
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="fecha_nacimiento_usuario">Fecha de Nacimiento</label>
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
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={closeModal} className="cancel-button-info-docent-admin">
                    Cancelar
                  </button>
                  <button type="button" onClick={handleNextStep} className="next-button-info-docent-admin">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
    
            {step === 2 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="correo_usuario">Correo</label>
                  <input
                    type="email"
                    id="correo_usuario"
                    name="correo_usuario"
                    placeholder="Correo"
                    value={formData.correo_usuario}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="register-input-container-info-docent-admin">
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
                <div className="register-input-container-info-docent-admin">
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
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={handlePreviousStep} className="previous-button-info-docent-admin">
                    Anterior
                  </button>
                  <button type="button" onClick={handleNextStep} className="next-button-info-docent-admin">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
    
            {step === 3 && (
              <div className="register-section-info-docent-admin">
                <div className="register-input-container-info-docent-admin">
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
                <div className="register-input-container-info-docent-admin">
                  <label htmlFor="idPregunta">Pregunta Secreta</label>
                  <select
                    id="idPregunta"
                    name="idPregunta"
                    value={formData.idPregunta}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {secretQuestions.map((pregunta) => (
                      <option key={pregunta.id_preguntas} value={pregunta.id_preguntas}>
                        {pregunta.nombre_preguntas}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="register-input-container-info-docent-admin">
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
    
                <div className="register-input-container-info-docent-admin">
                  <ReCAPTCHA
                    ref={captcha}
                    sitekey="6LdYfJspAAAAAAxTWQY68WAEX6JTgnysv3NxAMzd"
                    onChange={onChangeCaptcha}
                  />
                </div>
                <div className="button-group-info-docent-admin">
                  <button type="button" onClick={handlePreviousStep} className="previous-button-info-docent-admin">
                    Anterior
                  </button>
                  <button type="submit" className="save-button-info-docent-admin">
                    Registrar
                  </button>
                </div>
              </div>
            )}
          </form>
        </Modal>
    
        <Modal
          isOpen={isCsvModalOpen}
          onRequestClose={closeCsvModal}
          className="modal-info-docent-admin"
          overlayClassName="modal-overlay-info-docent-admin"
        >
          <h2>Subir Archivo CSV</h2>
          <input type="file" accept=".csv" onChange={handleCsvUpload}  className="save-button-info-docent-admin"/>
          <br /><br />
          <div className="button-group-info-docent-admin">
            
            <button type="button" onClick={closeCsvModal} className="cancel-button-info-docent-admin">
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={closeHelpModal}
        className="modal-info-docent-admin"
        overlayClassName="modal-overlay-info-docent-admin"
      >
        <div className="help-modal-content">
        <button className="help-modal-close" onClick={closeHelpModal}>
            &times;
          </button>
          <h2>Ayuda para la Inserción de Docentes</h2>
          <p>
            Para insertar docentes, puede hacerlo de esta manera:
          </p>
          <ul>
            
            <li>CSV: Subiendo un archivo CSV con los datos de los docentes.</li>
          </ul>
          <p>
            <strong>En el ID USUARIO PON UN :1</strong>
          </p>
          <p>
            Puede descargar un archivo CSV de ejemplo desde el siguiente enlace:
          </p>
          <a href={`${apiUrl}example_docent_csv`} download="ejemplo.csv">Descargar archivo CSV de ejemplo</a>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
      </div>
    );
}
