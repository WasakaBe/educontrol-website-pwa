import Modal from 'react-modal';
import { Alumn, Grado, Grupo } from '../../../../constants/interfaces';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { apiUrl } from '../../../../constants/Api';

interface ModalActualizarAlumnoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  alumno: Alumn | null;
}

export default function ModalActualizarAlumno({ isOpen, onRequestClose, alumno }: ModalActualizarAlumnoProps) {
  const [formData, setFormData] = useState<Alumn | null>(null);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  useEffect(() => {
    if (alumno) {
      setFormData(alumno);
    }
  }, [alumno]);

  useEffect(() => {
    // Obtener Grados
    const fetchGrados = async () => {
      try {
        const response = await fetch(`${apiUrl}grado`);
        if (response.ok) {
          const data = await response.json();
          setGrados(data);
        } else {
          console.error('Error al obtener los grados');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Obtener Grupos
    const fetchGrupos = async () => {
      try {
        const response = await fetch(`${apiUrl}grupo`);
        if (response.ok) {
          const data = await response.json();
          setGrupos(data);
        } else {
          console.error('Error al obtener los grupos');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchGrados();
    fetchGrupos();
  }, []);

  if (!formData) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => (prevData ? { ...prevData, [name]: value } : prevData));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Preparar los datos a enviar, asegurándose de enviar los IDs necesarios
    const updatedFormData = {
      ...formData,
      id_grado: grados.find((grado) => grado.nombre_grado === formData.grado)?.id_grado,
      id_grupo: grupos.find((grupo) => grupo.nombre_grupos === formData.grupo)?.id_grupos,
    };

    try {
      const response = await fetch(`${apiUrl}alumno-update/${formData.id_alumnos}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el alumno');
      }

      onRequestClose();
      alert('Alumno actualizado exitosamente');
    } catch (err) {
      let errorMessage = 'Error desconocido';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Error al actualizar el alumno: ${errorMessage}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-actualizar-alumn-admin"
      overlayClassName="modal-overlay-actualizar-alumn-admin"
    >
      <h2>Actualizar Información del Alumno</h2>
      <form onSubmit={handleSubmit}>
        {/* Información del Alumno */}
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre_alumnos"
            value={formData.nombre_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Apellido Paterno</label>
          <input
            type="text"
            name="app_alumnos"
            value={formData.app_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Apellido Materno</label>
          <input
            type="text"
            name="apm_alumnos"
            value={formData.apm_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento_alumnos"
            value={formData.fecha_nacimiento_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>CURP</label>
          <input
            type="text"
            name="curp_alumnos"
            value={formData.curp_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Número de Control</label>
          <input
            type="text"
            name="nocontrol_alumnos"
            value={formData.nocontrol_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="tel"
            name="telefono_alumnos"
            value={formData.telefono_alumnos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Seguro Social</label>
          <input
            type="text"
            name="seguro_social_alumnos"
            value={formData.seguro_social_alumnos}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Cuenta Credencial</label>
          <input
            type="text"
            name="cuentacredencial_alumnos"
            value={formData.cuentacredencial_alumnos}
            onChange={handleInputChange}
          />
        </div>

        {/* Información Académica */}
        <div>
          <label>Grado</label>
          <select
            name="grado"
            value={formData.grado}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un grado</option>
            {grados.map((grado) => (
              <option key={grado.id_grado} value={grado.nombre_grado}>
                {grado.nombre_grado}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Grupo</label>
          <select
            name="grupo"
            value={formData.grupo}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.id_grupos} value={grupo.nombre_grupos}>
                {grupo.nombre_grupos}
              </option>
            ))}
          </select>
        </div>

        {/* Dirección */}
        <div>
          <label>Municipio</label>
          <input
            type="text"
            name="municipio_alumnos"
            value={formData.municipio_alumnos}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Comunidad</label>
          <input
            type="text"
            name="comunidad_alumnos"
            value={formData.comunidad_alumnos}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Calle</label>
          <input
            type="text"
            name="calle_alumnos"
            value={formData.calle_alumnos}
            onChange={handleInputChange}
          />
        </div>

        {/* Información Familiar */}
        <h3>Información del Familiar</h3>
        <div>
          <label>Nombre Completo del Familiar</label>
          <input
            type="text"
            name="nombre_completo_familiar"
            value={formData.nombre_completo_familiar}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Teléfono Familiar</label>
          <input
            type="tel"
            name="telefono_familiar"
            value={formData.telefono_familiar}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Teléfono del Trabajo del Familiar</label>
          <input
            type="tel"
            name="telefono_trabajo_familiar"
            value={formData.telefono_trabajo_familiar}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Correo Familiar</label>
          <input
            type="email"
            name="correo_familiar"
            value={formData.correo_familiar}
            onChange={handleInputChange}
          />
        </div>

        {/* Botones */}
        <div className="button-group">
          <button type="button" onClick={onRequestClose} className="cancel-button">
            Cancelar
          </button>
          <button type="button" className="save-button">
            Actualizar
          </button>
        </div>
      </form>
    </Modal>
  );
}
