import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../constants/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './About.css';

interface SobreNosotros {
  id_sobre_nosotros: number;
  txt_sobre_nosotros: string;
  imagen_sobre_nosotros: string | null;
  fecha_sobre_nosotros: string;
}

const About: React.FC = () => {
  const [sobreNosotros, setSobreNosotros] = useState<SobreNosotros[]>([]);

  useEffect(() => {
    fetchSobreNosotros();
  }, []);

  const fetchSobreNosotros = async () => {
    try {
      const response = await fetch(`${apiUrl}sobre_nosotros`);
      const data = await response.json();
      if (data) {
        setSobreNosotros(data);
      } else {
        toast.error('No se encontró información sobre nosotros');
      }
    } catch  {
      toast.error('Error al cargar información sobre nosotros');
    }
  };

  return (
    <div className="about-container" id="Acerca">
      <h1>Sobre Nosotros</h1>
      {sobreNosotros.length > 0 ? (
        <div className="about-content">
          <div className="about-logo">
            {sobreNosotros[0].imagen_sobre_nosotros ? (
              <img
                src={`data:image/png;base64,${sobreNosotros[0].imagen_sobre_nosotros}`}
                alt="Sobre Nosotros"
                className="sobre-nosotros-imagen"
              />
            ) : (
              <span>null</span>
            )}
          </div>
          <div className="about-text">
            {sobreNosotros[0].txt_sobre_nosotros.split('\n').map((paragraph, index) => (
              <p key={index} className="sobre-nosotros-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>
      ) : (
        <p>No hay información disponible sobre nosotros en este momento.</p>
      )}
    </div>
  );
};

export default About;
