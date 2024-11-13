import React, { useState } from 'react';
import Modal from 'react-modal';
import './Feedback.css';
import { toast } from 'react-toastify';
import { apiUrl } from '../../constants/Api';

interface FeedbackModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  idUsuario: number; // Para identificar al usuario que envía el feedback
}

Modal.setAppElement('#root'); // Configuración para accesibilidad del modal

const Feedback: React.FC<FeedbackModalProps> = ({ isOpen, onRequestClose, idUsuario }) => {
  const [emocionFeedback, setEmocionFeedback] = useState('');
  const [motivoFeedback, setMotivoFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emocionFeedback || !motivoFeedback) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}create/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idusuario: idUsuario,
          emocion_feedback: emocionFeedback,
          motivo_feedback: motivoFeedback,
        })
      });

      if (response.ok) {
        toast.success('Feedback enviado correctamente');
        // Limpiar el formulario
        setEmocionFeedback('');
        setMotivoFeedback('');
        onRequestClose(); // Cerrar el modal después de enviar
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Feedback Modal"
      className="feedback-modal-feedback"
      overlayClassName="feedback-modal-overlay-feedback"
    >
      <h2>Agregar Feedback</h2>
      <button className="close-button-feedback" onClick={onRequestClose}>Cerrar</button>
      <form className="feedback-form-feedback" onSubmit={handleSubmit}>
        <div className="form-group-feedback">
        <label htmlFor="emocion_feedback">
    Por favor califique su experiencia utilizando los siguientes emojis y comparta cualquier sugerencia sobre cómo podemos mejorar.
  </label>
          <div className="emojis-feedback">
            <button
              type="button"
              className={`emoji-feedback ${emocionFeedback === 'satisfecho' ? 'selected-feedback' : ''}`}
              onClick={() => setEmocionFeedback('satisfecho')}
            >
              😃
            </button>
            <button
              type="button"
              className={`emoji-feedback ${emocionFeedback === 'medio satisfecho' ? 'selected-feedback' : ''}`}
              onClick={() => setEmocionFeedback('medio satisfecho')}
            >
              🙂
            </button>
            <button
              type="button"
              className={`emoji-feedback ${emocionFeedback === 'bien' ? 'selected-feedback' : ''}`}
              onClick={() => setEmocionFeedback('bien')}
            >
              😐
            </button>
            <button
              type="button"
              className={`emoji-feedback ${emocionFeedback === 'mal' ? 'selected-feedback' : ''}`}
              onClick={() => setEmocionFeedback('mal')}
            >
              🙁
            </button>
            <button
              type="button"
              className={`emoji-feedback ${emocionFeedback === 'peor' ? 'selected-feedback' : ''}`}
              onClick={() => setEmocionFeedback('peor')}
            >
              😡
            </button>
          </div>
        </div>
        <div className="form-group-feedback">
          <label htmlFor="motivo_feedback">Motivo del Feedback</label>
          <textarea
            id="motivo_feedback"
            value={motivoFeedback}
            onChange={(e) => setMotivoFeedback(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button-feedback">Enviar Feedback</button>
      </form>
    </Modal>
  );
};

export default Feedback;
