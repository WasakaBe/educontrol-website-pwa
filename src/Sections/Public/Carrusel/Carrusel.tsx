import React, { useEffect, useState } from 'react';
import './Carrusel.css';
import { apiUrl } from '../../../constants/Api';
import { getOfflineData, saveDataOffline } from '../../../db';

interface Image {
  carrusel: string;
}

const Carrusel: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${apiUrl}carrusel_imgs`);
      const data = await response.json();
      if (data.carrusel_imgs) {
        const formattedImages = data.carrusel_imgs.map((image: Image) => `data:image/jpeg;base64,${image.carrusel}`);
        setImages(formattedImages);

        // Guardar las imágenes en IndexedDB usando la clave "carruselImages"
        saveDataOffline({
          key: 'carruselImages',
          value: JSON.stringify(formattedImages),
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error fetching carrusel images:', error);

      // Intentar cargar imágenes desde IndexedDB si no hay conexión
      const cachedImages = await getOfflineData('carruselImages');
      if (cachedImages) {
        setImages(JSON.parse(cachedImages.value));
        console.log('Imágenes cargadas desde IndexedDB:', cachedImages);
      }
    }
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((image, idx) => (
          <img key={idx} src={image} alt={`panel ${idx + 1}`} className="carousel-item" />
        ))}
      </div>
      <button className="carousel-button prev" onClick={handlePrev}>❮</button>
      <button className="carousel-button next" onClick={handleNext}>❯</button>
    </div>
  );
};

export default Carrusel;
