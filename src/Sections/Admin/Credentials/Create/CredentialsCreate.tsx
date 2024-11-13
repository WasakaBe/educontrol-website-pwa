import { useState } from 'react';
import { apiUrl } from '../../../../constants/Api';
import './CredentialsCreate.css';
import { logo_cbta, logoeducacion } from '../../../../assets/logos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alumnos } from '../../../../constants/interfaces';
import Modal from 'react-modal';

export default function CredentialsCreateCustom() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [controlNumber, setControlNumber] = useState<string>('');
  const [alumno, setAlumno] = useState<Alumnos | null>(null);
  const [, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setControlNumber(value);
    }
  };

  const handleFetchAlumno = async () => {
    try {
      const response = await fetch(`${apiUrl}alumnos/nocontrol/${controlNumber}`);
      if (!response.ok) {
        throw new Error('Alumno no encontrado');
      }
      const data: Alumnos = await response.json();
      setAlumno(data);
      setError(null);
      toast.success('Alumno encontrado exitosamente');
    } catch (error) {
      setError((error as Error).message);
      setAlumno(null);
      toast.error('Error al buscar el alumno');
    }
  };

  const handleAddCredencial = async () => {
    if (alumno) {
      const credencialData = {
        nombre_credencial_escolar: alumno.nombre_alumnos,
        app_credencial_escolar: alumno.app_alumnos,
        apm_credencial_escolar: alumno.apm_alumnos,
        carrera_credencial_escolar: alumno.carrera_tecnica,
        grupo_credencial_escolar: alumno.grupo,
        curp_credencial_escolar: alumno.curp_alumnos,
        nocontrol_credencial_escolar: alumno.nocontrol_alumnos,
        segsocial_credencial_escolar: alumno.seguro_social_alumnos,
        foto_credencial_escolar: alumno.foto_usuario,
        idalumnocrede: alumno.id_alumnos,
      };

      try {
        const response = await fetch(`${apiUrl}credencial_escolar/insert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credencialData),
        });

        if (!response.ok) {
          throw new Error('Error al agregar la credencial escolar');
        }

        // Limpiar el estado y reiniciar el campo de entrada
        setSuccess('Credencial escolar agregada exitosamente');
        setAlumno(null);
        setControlNumber('');
        setError(null);
        toast.success('Credencial escolar agregada exitosamente');
      } catch (error) {
        setError((error as Error).message);
        setSuccess(null);
        toast.error('Error al agregar la credencial escolar');
      }
    }
  };

  const handleCancel = () => {
    setControlNumber('');
    setAlumno(null);
    setError(null);
    setSuccess(null);
    toast.info('Operación cancelada');
  };

  return (
    <div className="credentials-create-custom-container">
      <ToastContainer />
      <form
        className="credentials-create-custom-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchAlumno();
        }}
      >
        <label htmlFor="controlNumber">Ingrese el número de control:</label>
        <input
          type="text"
          id="controlNumber"
          name="controlNumber"
          value={controlNumber}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
        <br />
        <br />
      </form>
      {alumno && (
        <div>
          <div className="credential-custom-card">
            <div className="custom-header">
              <img
                src={logoeducacion}
                alt="Logo SEP"
                className="custom-sep-logo"
              />
              <img
                src={logo_cbta}
                alt="Logo CBTA 5"
                className="custom-cbta-logo"
              />
            </div>
            <div className="custom-body-credencial">
              <div className="custom-photo-section">
                <img
                  src={
                    alumno.foto_usuario
                      ? `data:image/jpeg;base64,${alumno.foto_usuario}`
                      : 'default-photo.png'
                  }
                  alt="Foto del Alumno"
                  className="custom-student-photo"
                />
                <div className="custom-name-logo-credential">
                  <h2 className="custom-student-name">
                    {alumno.nombre_alumnos} {alumno.app_alumnos}{' '}
                    {alumno.apm_alumnos}
                  </h2>
                  <img
                    src={
                      alumno.foto_carrera_tecnica
                        ? `data:image/jpeg;base64,${alumno.foto_carrera_tecnica}`
                        : 'default-logo.png'
                    }
                    alt="Logo de la Carrera"
                    className="custom-career-logo"
                  />
                </div>
              </div>
              <div className="custom-info-section">
                <h3>TÉCNICO EN {alumno.carrera_tecnica.toUpperCase()}</h3>
                <p>
                  <strong>GRUPO:</strong> {alumno.grupo}
                </p>
                <p>
                  <strong>CURP:</strong> {alumno.curp_alumnos}
                </p>
                <p>
                  <strong>NO. CONTROL:</strong> {alumno.nocontrol_alumnos}
                </p>
                <p>
                  <strong>SEGURO SOCIAL:</strong> {alumno.seguro_social_alumnos}
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="align">
            <button
              className="exit-button"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="save-button"
              type="button"
              onClick={handleAddCredencial}
            >
              Agregar
            </button>
          </div>
        </div>
      )}

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
          <h2>Ayuda para la Inserción de Credencial Escolar del Alumno</h2>
          <p>Para insertar alumnos, debes hacerlo de esta manera:</p>
          <p>
            <strong>Debes Ingresar el No Control del alumno en el campo de texto</strong>
          </p>
          <p>Posteriormente, dar clic en el botón de "Agregar"</p>
        </div>
      </Modal>

      <button className="floating-help-button" onClick={openHelpModal}>
        ?
      </button>
    </div>
  );
}
