import React, { useState, useEffect, useRef } from 'react';
import './Activities.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../../constants/Api';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Activity {
  imagen_actividad_noticia: string;
  titulo_actividad_noticia: string;
  descripcion_actividad_noticia: string;
}

const Activities: React.FC = () => {
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${apiUrl}actividades_noticias`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Activity[] = await response.json();
      if (data.length) {
        setActivitiesData(data);
      } else {
        toast.info('No hay actividades noticias disponibles.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error fetching actividades noticias: ' + error.message);
      }
    }
  };

  const handleNext = () => {
    const slide = slideRef.current;
    if (slide && slide.firstElementChild) {
      slide.appendChild(slide.firstElementChild);
    }
  };

  const handlePrev = () => {
    const slide = slideRef.current;
    if (slide && slide.lastElementChild) {
      slide.prepend(slide.lastElementChild);
    }
  };

  return (
    <div className="container-act">
      <div id="slide" ref={slideRef}>
        {activitiesData.map((activity, index) => (
          <div 
            key={index} 
            className="item" 
            style={{ backgroundImage: `url(data:image/png;base64,${activity.imagen_actividad_noticia})` }}
          >
            <div className="content">
              <div className="name">{activity.titulo_actividad_noticia}</div>
              <br />
              <div className="des">{activity.descripcion_actividad_noticia}</div>
              <br />
              <button className="save-button" >Ver más</button>
            </div>
          </div>
        ))}
      </div>
      <div className="buttonsx">
        <button className="b1" id="prev" onClick={handlePrev}>
          <span className="icon"> <IoChevronBackOutline /></span> 
        </button>
        <button className="b1" id="next" onClick={handleNext}>
           <span className="icon"> <IoChevronForwardOutline /></span>
        </button>
      </div>
    </div>
  );
};

export default Activities;
