import React, { useState, useContext, FormEvent } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { alumnos_honores } from '../../assets/images'
import './Login.css'
import { apiUrl } from '../../constants/Api'
import { useNavigate } from 'react-router-dom'
import { AuthContext, User } from '../../Auto/Auth'
import Register from '../Register/Register'
import PasswordReset from '../ForgoutPwd/ForgoutPwd'

interface LoginProps {
  onClose: () => void
}

interface ApiResponse {
  tbl_users: User
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const history = useNavigate()
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider')
  }

  const { login } = authContext
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  const validateEmail = (email: string): boolean => {
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
          toast.success('Correo disponible')
          setEmailSubmitted(true)
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
        toast.error('Error al verificar el correo ,$error')
      }
    } else {
      setEmailError('Por favor, ingrese un correo electrónico válido.')
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.trim() === '') {
      toast.error('Por favor, ingrese su contraseña.')
      return
    }

    if (password.length >= 6) {
      try {
        const response = await fetch(`${apiUrl}login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo_usuario: email,
            pwd_usuario: password,
          }),
        })
        const data: ApiResponse = await response.json()
        if (response.status === 200 && data.tbl_users) {
          const user = data.tbl_users

          if (user.pwd_usuario === password) {
            login(user)
            const userName = user.nombre_usuario
            if (user.idRol === 1) {
              toast.success(`Bienvenido administrador ${userName}`)
              history(`/Administration/${userName}`, {
                state: { user2: userName },
              })
            } else if (user.idRol === 2) {
              toast.success(`Bienvenido alumno ${userName}`)
              history(`/Alumn/${userName}`, { state: { user2: userName } })
            } else if (user.idRol === 3) {
              toast.success(`Bienvenido docente ${userName}`)
              history(`/Docent/${userName}`, { state: { user2: userName } })
            } else if (user.idRol === 4) {
              toast.success(`Bienvenido familiar ${userName}`)
              history(`/Familiar/${userName}`, { state: { user2: userName } })
            }
            setPasswordError('')
          } else {
            toast.error('Datos no coinciden')
            setPasswordError('Datos no coinciden')
          }
        } else {
          toast.error('Password erróneo')
          setPasswordError('Password erróneo')
        }
      } catch {
        toast.error('Error al iniciar sesión')
      }
    } else {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.')
    }
  }

  const handleBackClick = () => {
    setEmailSubmitted(false)
    setPassword('')
    setPasswordError('')
  }

  const handleRegisterClick = () => {
    setShowRegister(true)
  }

  const handlePasswordResetClick = () => {
    setShowPasswordReset(true)
  }

  return (
    <div className="modal-overlay-login">
      <div className="modal-content-login">
        <div className="left-panel">
          <img
            src={alumnos_honores}
            alt="Left Panel Image"
            className="left-panel-img"
          />
        </div>
        <div className="right-panel">
          <h2>Iniciar Sesión</h2>
          {emailSubmitted ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? 'error' : password && 'success'}
                  required
                  autoComplete="current-password" 
                />
                {passwordError && <p className="error-text">{passwordError}</p>}
                <div className="buttons">
                  <button
                    type="button"
                    className="back-button"
                    onClick={handleBackClick}
                  >
                    Atrás
                  </button>
                  <button type="submit" className="login-button">
                    Acceder
                  </button>
                </div>
                <a
                  href="#"
                  className="crearcuenta"
                  onClick={handlePasswordResetClick}
                >
                  Olvidaste tu password?
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              <div className="input-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email-login"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={emailError ? 'error' : email && 'success'}
                  required
                   autoComplete="username"
                />
                {emailError && <p className="error-text">{emailError}</p>}
                <button type="submit" className="login-button">
                  Siguiente
                </button>
              </div>
            </form>
          )}
          <a href="#" className="crearcuenta" onClick={handleRegisterClick}>
            Crear Cuenta
          </a>
          <button onClick={onClose} className="close-button-login">
            Cerrar
          </button>
        </div>
      </div>
      {showRegister && <Register onClose={() => setShowRegister(false)} />}{' '}
      {/* Muestra la modal de registro */}
      {showPasswordReset && (
        <PasswordReset onClose={() => setShowPasswordReset(false)} />
      )}{' '}
      {/* Muestra la modal de restablecimiento de contraseña */}
    </div>
  )
}

export default Login
