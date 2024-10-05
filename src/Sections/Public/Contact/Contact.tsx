import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Contact.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../../constants/Api';

const Contact: React.FC = () => {
  const MAPURL =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.098299591696!2d-98.4068462247401!3d21.148485980530932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726fcf9f14585%3A0x897e90570d60ad67!2sCBTa%20No.%205!5e0!3m2!1ses!2smx!4v1704246777334!5m2!1ses!2smx';

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nameValid, setNameValid] = useState<boolean>(true);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [messageValid, setMessageValid] = useState<boolean>(true);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isValid = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(inputValue);
    setName(inputValue);
    setNameValid(isValid);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const isValid = inputValue.trim().split(/\s+/).length <= 450;
    setMessage(inputValue);
    setMessageValid(isValid);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nameValid && emailValid && messageValid) {
      try {
        const fechaMensajeContacto = new Date().toISOString();
        const response = await fetch(`${apiUrl}mensaje_contacto/insert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_mensaje_contacto: name,
            correo_mensaje_contacto: email,
            motivo_mensaje_contacto: message,
            fecha_mensaje: fechaMensajeContacto,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Mensaje enviado exitosamente');
          setName('');
          setEmail('');
          setMessage('');
        } else {
          toast.error(`Error al enviar el mensaje: ${data.error}`);
        }
      } catch{
        toast.error('Error al enviar el mensaje');
      }
    } else {
      toast.error('Por favor, revise los campos ingresados');
    }
  };

  return (
    <div className="container-contact" id="Contact">
      <h1 className="contact-title">Contáctanos</h1>
      <div className="dates-contacts">
        <iframe title="Google Map" src={MAPURL} className="contact-map" />
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className={`input-container ${nameValid ? 'valid' : 'invalid'}`}>
            <label className="contact-label" htmlFor="name">Nombre</label>
            <input
              className="contact-input"
              id="name"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className={`input-container ${emailValid ? 'valid' : 'invalid'}`}>
            <label className="contact-label" htmlFor="email">Correo</label>
            <input
              className="contact-input"
              id="email"
              type="email"
              placeholder="Correo"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className={`input-container ${messageValid ? 'valid' : 'invalid'}`}>
            <label className="contact-label" htmlFor="message">Mensaje</label>
            <textarea
              className="contact-input"
              id="message"
              rows={5}
              placeholder="Mensaje"
              value={message}
              onChange={handleMessageChange}
              required
            />
          </div>
          <button className="contact-btn" type="submit">
            Enviar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;
