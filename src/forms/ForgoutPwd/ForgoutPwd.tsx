import { useState, useEffect, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { apiUrl } from '../../constants/Api'

interface PasswordResetProps {
  onClose: () => void
}

interface Question {
  id_preguntas: number
  nombre_preguntas: string
}

const PasswordReset = ({ onClose }: PasswordResetProps) => {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')
  const [method, setMethod] = useState<string>('') // 'question' or 'token'
  const [step, setStep] = useState<number>(1) // 1: Email, 2: Select Method, 3: Verify, 4: Reset Password

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`${apiUrl}pregunta`)
        const data = await response.json()
        setQuestions(data)
      } catch  {
      
        toast.error('Error al cargar las preguntas de seguridad' )
      }
    }
    fetchQuestions()
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (validateEmail(email)) {
      try {
        const response = await fetch(`${apiUrl}check-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo_usuario: email }),
        })
        const data = await response.json()
        if (response.status === 200 && data.exists) {
          toast.success(
            'Correo verificado. Seleccione el método de restablecimiento de contraseña.'
          )
          setStep(2) // Move to select method step
          setEmailError('')
        } else {
          toast.error(
            'El correo ingresado no se encuentra disponible o no existe'
          )
          setEmailError(
            'El correo ingresado no se encuentra disponible o no existe'
          )
        }
      } catch {
        toast.error('Error al verificar el correo')
      }
    } else {
      setEmailError('Por favor, ingrese un correo electrónico válido.')
    }
  }

  const handleMethodSelect = async (selectedMethod: string) => {
    setMethod(selectedMethod)
    if (selectedMethod === 'token') {
      try {
        const response = await fetch(`${apiUrl}get-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo_usuario: email }),
        })
        if (response.status === 200) {
          toast.success('Token enviado a su correo electrónico.')
          setStep(3) // Move to token verification step
        } else {
          toast.error('Error al enviar el token.')
        }
      } catch {
        toast.error('Error al enviar el token.')
      }
    } else {
      setStep(3) // Move to question verification step
    }
  }

  const handleQuestionSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedQuestion && answer) {
      try {
        const response = await fetch(`${apiUrl}recover-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo_usuario: email,
            idPregunta: parseInt(selectedQuestion),
            respuestaPregunta: answer,
          }),
        })

        if (response.status === 200) {
          toast.success(
            'Pregunta y respuesta verificadas. Puede restablecer su contraseña.'
          )
          setStep(4) // Move to password reset step
        } else {
          toast.error('Las credenciales proporcionadas no coinciden')
        }
      } catch  {
        toast.error('Error al verificar la respuesta')
      }
    } else {
      toast.error('Por favor, seleccione una pregunta e ingrese la respuesta.')
    }
  }

  const handleTokenSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_usuario: token }),
      })
      if (response.status === 200) {
        toast.success('Token verificado. Puede restablecer su contraseña.')
        setStep(4) // Move to password reset step
      } else {
        toast.error('Token incorrecto')
      }
    } catch {
      toast.error('Error al verificar el token')
    }
  }

  const validatePassword = (password: string) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
    return re.test(password)
  }

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault()
    if (!validatePassword(newPassword)) {
      toast.error(
        'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y caracteres especiales.'
      )
      return
    }
    if (newPassword !== repeatPassword) {
      toast.error('Las contraseñas no coinciden.')
      return
    }
    try {
      const response = await fetch(`${apiUrl}updates-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo_usuario: email,
          new_password: newPassword,
        }),
      })
      if (response.status === 200) {
        toast.success('Contraseña restablecida correctamente.')
        onClose()
      } else {
        toast.error('Error al restablecer la contraseña.')
      }
    } catch {
      toast.error('Error al restablecer la contraseña.')
    }
  }

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-content">
        <h2>Restablecer Contraseña</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="register-input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? 'error' : email ? 'success' : ''}
                required
              />
              {emailError && <p className="error-text">{emailError}</p>}
              <br />
              <button type="submit" className="login-button">
                Siguiente
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <div className="buttons">
            <button
              onClick={() => handleMethodSelect('question')}
              className="login-button"
            >
              Pregunta de Seguridad
            </button>
            <button
              onClick={() => handleMethodSelect('token')}
              className="login-button"
            >
              Token de Correo
            </button>
          </div>
        )}
        {step === 3 && method === 'question' && (
          <form onSubmit={handleQuestionSubmit}>
            <div className="register-input-container">
              <label htmlFor="question">Pregunta de Seguridad</label>
              <select
                id="question"
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                required
              >
                <option value="">Seleccione una pregunta</option>
                {questions.map((question) => (
                  <option
                    key={question.id_preguntas}
                    value={question.id_preguntas}
                  >
                    {question.nombre_preguntas}
                  </option>
                ))}
              </select>
              <label htmlFor="answer">Respuesta</label>
              <input
                type="text"
                id="answer"
                placeholder="Ingrese su respuesta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="login-button">
                Verificar
              </button>
            </div>
          </form>
        )}
        {step === 3 && method === 'token' && (
          <form onSubmit={handleTokenSubmit}>
            <div className="register-input-container">
              <label htmlFor="token">Ingrese su token</label>
              <input
                type="text"
                id="token"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="next-button">
                Verificar Token
              </button>
            </div>
          </form>
        )}
        {step === 4 && (
          <form onSubmit={handlePasswordReset}>
            <div className="register-input-container">
              <label htmlFor="newPassword">Ingrese su nueva contraseña</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="repeatPassword">Repita su nueva contraseña</label>
              <input
                type="password"
                id="repeatPassword"
                placeholder="Repita la nueva contraseña"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="login-button">
                Restablecer Contraseña
              </button>
            </div>
          </form>
        )}
        <button onClick={onClose} className="close-button-login">
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default PasswordReset
