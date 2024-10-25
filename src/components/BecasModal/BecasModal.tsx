import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../constants/Api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './BecasModal.css'

interface Beca {
  id_info_becas: number
  titulo_info_becas: string
  descripcion_info_becas: string
  requisitos_info_becas: string
  foto_info_becas: string
}

interface BecasModalProps {
  onClose: () => void
}

const BecasModal: React.FC<BecasModalProps> = ({ onClose }) => {
  const [becas, setBecas] = useState<Beca[]>([])

  useEffect(() => {
    fetch(`${apiUrl}info_becas`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBecas(data)
        } else {
          toast.error('Error fetching data: Data is not an array')
        }
      })
      .catch((error) => toast.error('Error fetching data:', error))
  }, [])

  return (
    <div className="modal-overlay-custom">
      <div className="modal-custom">
        <h2>Información de Becas</h2>
        <div className="becas-container-custom">
          {becas.length > 0 ? (
            becas.map((beca) => (
              <div key={beca.id_info_becas} className="beca-card-custom">
                <div className="beca-content-custom">
                  {beca.foto_info_becas && (
                    <div className="beca-image-container-custom">
                      <img
                        src={`data:image/jpeg;base64,${beca.foto_info_becas}`}
                        alt="Foto de Beca"
                        className="beca-image-custom"
                      />
                    </div>
                  )}
                  <div>
                    <h3>{beca.titulo_info_becas}</h3>
                    <p>{beca.descripcion_info_becas}</p>
                    <h4>Requisitos:</h4>
                    <ul>
                      {beca.requisitos_info_becas
                        .split('\n')
                        .map((requisito, index) => (
                          <li key={index}>{requisito}</li>
                        ))}
                    </ul>
                  </div>
                </div>
                <h3>Ir a control escolar para mas informacion</h3>
              </div>
            ))
          ) : (
            <p className="no-records-custom">No hay registros</p>
          )}
        </div>
        <button className="close-button-custom" onClick={onClose}>
          X
        </button>
        <ToastContainer />
      </div>
    </div>
  )
}

export default BecasModal
