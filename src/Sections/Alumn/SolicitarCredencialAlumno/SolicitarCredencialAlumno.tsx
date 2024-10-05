import { useState, useEffect, ChangeEvent, FormEvent, useContext } from 'react';
import './SolicitarCredencialAlumno.css';
import { apiUrl } from '../../../constants/Api';
import { AuthContext } from '../../../Auto/Auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definimos la interfaz para los motivos de credencial
interface MotivoCredencial {
  id_motivo_credencial: number;
  nombre_motivo_credencial: string;
}

// Definimos la interfaz para el alumno
interface Alumno {
  id_alumnos: number;
  nombre_alumnos: string;
  // otras propiedades del alumno...
}

export default function SolicitarCredencialAlumno() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user } = authContext;
  const [formData, setFormData] = useState({
    idalumno: '',
    idmotivo: '',
    fecha_motivo_credencial: ''
  });

  const [motivos, setMotivos] = useState<MotivoCredencial[]>([]);
  const [, setAlumno] = useState<Alumno | null>(null);

  useEffect(() => {
    if (user) {
      const fetchAlumno = async () => {
        try {
          const response = await fetch(`${apiUrl}alumno/usuario/${user.id_usuario}`);
          const result = await response.json();
          setAlumno(result);
          setFormData((prevFormData) => ({
            ...prevFormData,
            idalumno: result.id_alumnos.toString()
          }));
        } catch {
          toast.error('Error al obtener la información del alumno');
        }
      };

      fetchAlumno();
    }
  }, [user]);

  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const response = await fetch(`${apiUrl}motivos_credencial`);
        const result = await response.json();
        setMotivos(result.motivos_credencial);
      } catch{
        toast.error('Error al obtener los motivos de credencial');
      }
    };

    fetchMotivos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}mensaje_motivo_credencial/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Mensaje enviado correctamente');
      } else {
        const error = await response.json();
        toast.error(error.error);
      }
    } catch  {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div className="solicitar-form-container">
      <h1 className="solicitar-title">Solicitar Credencial de Alumno</h1>
      <form className="solicitar-form" onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="idalumno"
          value={formData.idalumno}
        />
        <div className="solicitar-form-group">
          <label className="solicitar-label">Motivo de la solicitud</label>
          <select
            className="solicitar-select"
            name="idmotivo"
            value={formData.idmotivo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un motivo</option>
            {motivos.map((motivo) => (
              <option key={motivo.id_motivo_credencial} value={motivo.id_motivo_credencial}>
                {motivo.nombre_motivo_credencial}
              </option>
            ))}
          </select>
        </div>
        <div className="solicitar-form-group">
          <label className="solicitar-label">Fecha</label>
          <input
            className="solicitar-input"
            type="date"
            name="fecha_motivo_credencial"
            value={formData.fecha_motivo_credencial}
            onChange={handleChange}
            required
          />
        </div>
        <button className="solicitar-button" type="submit">Enviar</button>
      </form>
      <ToastContainer />
    </div>
  );
}
