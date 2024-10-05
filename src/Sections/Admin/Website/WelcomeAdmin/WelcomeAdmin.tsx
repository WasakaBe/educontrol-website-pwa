import { useEffect, useState } from 'react';
import './WelcomeAdmin.css';
import { apiUrl } from '../../../../constants/Api';

// Definir la interfaz para los datos de bienvenida
interface Welcome {
  id_welcome: number;
  welcome_text: string;
  foto_welcome: string; // Base64 string for the image
}

export default function WelcomeAdmin() {
  const [welcomes, setWelcomes] = useState<Welcome[]>([]);
  const [newWelcomeText, setNewWelcomeText] = useState<string>('');
  const [newWelcomeFile, setNewWelcomeFile] = useState<File | null>(null);
  const [updateWelcomeText, setUpdateWelcomeText] = useState<string>('');
  const [updateWelcomeFile, setUpdateWelcomeFile] = useState<File | null>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);

  useEffect(() => {
    fetchWelcomes();
  }, []);

  const fetchWelcomes = () => {
    fetch(`${apiUrl}welcome`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWelcomes(data);
        } else {
          console.error('Error fetching welcomes:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching welcomes:', error);
      });
  };

  const handleAddWelcome = () => {
    if (newWelcomeText && newWelcomeFile) {
      const formData = new FormData();
      formData.append('welcome_text', newWelcomeText);
      formData.append('foto_welcome', newWelcomeFile);

      fetch(`${apiUrl}welcomes/insert`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Bienvenida creada exitosamente') {
            setNewWelcomeText('');
            setNewWelcomeFile(null);
            fetchWelcomes();
          } else {
            console.error('Error adding welcome:', data.message);
          }
        })
        .catch(error => {
          console.error('Error adding welcome:', error);
        });
    } else {
      console.error('Welcome text and file are required.');
    }
  };

  const handleUpdateWelcome = () => {
    if (updateId && (updateWelcomeText || updateWelcomeFile)) {
      const formData = new FormData();
      if (updateWelcomeText) formData.append('welcome_text', updateWelcomeText);
      if (updateWelcomeFile) formData.append('foto_welcome', updateWelcomeFile);

      fetch(`${apiUrl}welcome/update/${updateId}`, {
        method: 'PUT',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Bienvenida actualizada exitosamente') {
            setUpdateWelcomeText('');
            setUpdateWelcomeFile(null);
            setUpdateId(null);
            fetchWelcomes();
          } else {
            console.error('Error updating welcome:', data.message);
          }
        })
        .catch(error => {
          console.error('Error updating welcome:', error);
        });
    } else {
      console.error('Update ID and either text or file are required.');
    }
  };

  const handleCloseModal = () => {
    setUpdateId(null);
    setUpdateWelcomeText('');
    setUpdateWelcomeFile(null);
  };

  return (
    <div className="welcome-admin-container">
      <h2>Welcome Admin</h2>
      <table className="welcome-admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bienvenida</th>
            <th>Foto</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {welcomes.map(welcome => (
            <tr key={welcome.id_welcome}>
              <td>{welcome.id_welcome}</td>
              <td>{welcome.welcome_text}</td>
              <td>
                {welcome.foto_welcome && (
                  <img
                    src={`data:image/jpeg;base64,${welcome.foto_welcome}`}
                    alt={`Welcome ${welcome.id_welcome}`}
                    className="welcome-admin-image"
                  />
                )}
              </td>
              <td>
                <button className='edit-button' onClick={() => setUpdateId(welcome.id_welcome)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-welcome-admin-form">
        <h3>Add New Welcome</h3>
        <input
          type="text"
          value={newWelcomeText}
          onChange={(e) => setNewWelcomeText(e.target.value)}
          placeholder="Welcome Text"
        />
        <input
          type="file"
          onChange={(e) => setNewWelcomeFile(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={handleAddWelcome}>Add Welcome</button>
      </div>
      {updateId && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <div className='form-group'>
              <h3>Update Welcome</h3>
              <input
                type="text"
                value={updateWelcomeText}
                onChange={(e) => setUpdateWelcomeText(e.target.value)}
                placeholder="Update Text"
              />
              <input
                type="file"
                onChange={(e) => setUpdateWelcomeFile(e.target.files ? e.target.files[0] : null)}
              />
              <button className='edit-button' onClick={handleUpdateWelcome}>Update Welcome</button>
              <button className='exit-button' onClick={handleCloseModal}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
