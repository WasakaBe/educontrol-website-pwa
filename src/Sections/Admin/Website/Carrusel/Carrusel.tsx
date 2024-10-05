import { useEffect, useState, ChangeEvent } from 'react';
import { apiUrl } from '../../../../constants/Api';
import './Carrusel.css';

interface CarruselImage {
  id_carrusel: number;
  carrusel: string; // Base64 string for the image
}

export default function Carrusel() {
  const [images, setImages] = useState<CarruselImage[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(`${apiUrl}carrusel_imgs`)
      .then(response => response.json())
      .then(data => {
        if (data.carrusel_imgs) {
          setImages(data.carrusel_imgs);
        }
      })
      .catch(error => {
        console.error('Error fetching carrusel images:', error);
      });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAddImage = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('carrusel', selectedFile);

      fetch(`${apiUrl}carrusel_imgs/insert`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
          }
          return response.json();
        })
        .then(data => {
          if (data.message === 'Imagen del carrusel insertada exitosamente') {
            setShowModal(false);
            setSelectedFile(null);
            fetchImages();
          } else {
            console.error('Error adding image:', data.message);
          }
        })
        .catch(error => {
          console.error('Error adding image:', error.message);
        });
    }
  };

  const handleDeleteImage = (id: number) => {
    fetch(`${apiUrl}carrusel_imgs/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Imagen del carrusel eliminada exitosamente') {
          fetchImages();
        } else {
          console.error('Error deleting image:', data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting image:', error);
      });
  };

  return (
    <div className="carrusel-container">
      <button className="add-image-button" onClick={() => setShowModal(true)}>
        Agregar Imágenes
      </button>
      {images.length > 0 ? (
        <table className="carrusel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {images.map(image => (
              <tr key={image.id_carrusel}>
                <td>{image.id_carrusel}</td>
                <td>
                  <img
                    src={`data:image/jpeg;base64,${image.carrusel}`}
                    alt={`Carrusel ${image.id_carrusel}`}
                    className="carrusel-image"
                  />
                </td>
                <td>
                  <button className='edit-button' onClick={() => handleDeleteImage(image.id_carrusel)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay imágenes disponibles en el carrusel.</p>
      )}

      {showModal && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <span className="register-close-button" onClick={() => setShowModal(false)}>&times;</span>
            <div className='form-group'>
              <h2>Agregar Imagen</h2>
              <input className='register-input-container' type="file" onChange={handleFileChange} />
              <button className='save-button' onClick={handleAddImage}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
