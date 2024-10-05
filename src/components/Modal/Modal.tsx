import React, { ReactNode, MouseEvent } from 'react'
import './Modal.css'

interface ModalProps {
  show: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  if (!show) {
    return null
  }

  const handleOverlayClick = () => {
    onClose()
  }

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div className="modal-overlay4" onClick={handleOverlayClick}>
      <div className="modal-4" onClick={handleModalClick}>
        <div className="modal-header4">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button-2">
            X
          </button>
        </div>
        <div className="modal-body4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
