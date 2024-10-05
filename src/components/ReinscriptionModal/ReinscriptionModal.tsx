import React from 'react'
import './ReinscriptionModal.css'

interface ReinscriptionModalProps {
  onClose: () => void
}

const ReinscriptionModal: React.FC<ReinscriptionModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay-custom">
      <div className="modal-custom">
        <button className="modal-close close-button-custom" onClick={onClose}>
          &times;
        </button>
        <h2>Información de Reinscripcion</h2>
        <div className="becas-container-custom">
          <p>Sin Informacion Por el Momento</p>
          <br />
        </div>
        <h3>Ir a control escolar para mas informacion</h3>
      </div>
    </div>
  )
}

export default ReinscriptionModal
