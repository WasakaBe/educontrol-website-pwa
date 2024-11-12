import React, { useState, useContext, useRef, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../../Auto/Auth'
import { apiUrl } from '../../../constants/Api'
import { saveDataOffline, getOfflineData } from '../../../db' // Importamos IndexedDB

const ProfileDocentDashboard: React.FC = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider')
  }

  const { user, login } = authContext

  const [isEditing, setIsEditing] = useState(false)
  const [nombre, setNombre] = useState(user?.nombre_usuario || '')
  const [app, setApp] = useState(user?.app_usuario || '')
  const [apm, setApm] = useState(user?.apm_usuario || '')
  const [email, setEmail] = useState(user?.correo_usuario || '')
  const [password, setPassword] = useState(user?.pwd_usuario || '')
  const [foto, setFoto] = useState<string | ArrayBuffer | null>(
    user?.foto_usuario ? `data:image/jpeg;base64,${user.foto_usuario}` : ''
  )
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    loadProfileOffline()
  }, [])

  const loadProfileOffline = async () => {
    try {
      const cachedProfile = await getOfflineData('profileDocentData')
      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile.value)
        setNombre(profile.nombre_usuario)
        setApp(profile.app_usuario)
        setApm(profile.apm_usuario)
        setEmail(profile.correo_usuario)
        setPassword(profile.pwd_usuario)
        setFoto(profile.foto_usuario ? `data:image/jpeg;base64,${profile.foto_usuario}` : '')
        toast.info('Datos del perfil cargados desde IndexedDB')
      }
    } catch (error) {
      console.error('Error al cargar el perfil desde IndexedDB:', error)
    }
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing)
    toast.info(isEditing ? 'Modo edición desactivado' : 'Modo edición activado')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNombre(user?.nombre_usuario || '')
    setApp(user?.app_usuario || '')
    setApm(user?.apm_usuario || '')
    setEmail(user?.correo_usuario || '')
    setPassword(user?.pwd_usuario || '')
    setFoto(
      user?.foto_usuario ? `data:image/jpeg;base64,${user.foto_usuario}` : ''
    )
    toast.info('Modo edición desactivado')
  }

  const handleSave = async () => {
    if (user) {
      const updatedUser = {
        nombre_usuario: nombre,
        app_usuario: app,
        apm_usuario: apm,
        correo_usuario: email,
        pwd_usuario: password,
        foto_usuario: foto ? (foto as string).split(',')[1] : '',
      }

      try {
        const response = await fetch(
          `${apiUrl}update-profile-docente/${user.id_usuario}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
          }
        )

        if (response.ok) {
          login({ ...user, ...updatedUser })
          setIsEditing(false)
          toast.success('Perfil actualizado con éxito')

          // Guardar en IndexedDB
          await saveDataOffline({
            key: 'profileDocentData',
            value: JSON.stringify(updatedUser),
            timestamp: Date.now(),
          })
          toast.success('Perfil guardado para acceso offline')
        } else {
          toast.error('Error al actualizar el perfil')
        }
      } catch {
        toast.error('Error al actualizar el perfil')
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const openCamera = () => {
    setShowCamera(true)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        streamRef.current = stream
      })
      .catch((err) => {
        toast.error(`Error al acceder a la cámara: ${err.message}`)
      })
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setFoto(imageData)
      }
      setShowCamera(false)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  return (
    <div className="container-profile-admin">
      <ToastContainer />
      <div className="header-profile-admin">
        <h2>{isEditing ? 'Editar Perfil' : 'Perfil'}</h2>
      </div>
      <div className="avatar-container-profile-admin">
        <img
          className="avatar-profile-admin"
          src={
            (foto as string) ||
            'https://i.pinimg.com/564x/48/84/3b/48843b6ea8fead404661af7b00397142.jpg'
          }
          alt="Perfil de administrador"
        />

        {isEditing && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} className="save-button-profile-admin"/>
            <button onClick={openCamera} className="save-camera-button-profile-admin">
              📷 Tomar foto
            </button>
            {showCamera && (
              <div className="camera-container">
                <video ref={videoRef} className="video-feed"></video>
                <button onClick={capturePhoto} className="save-camera-button-profile-admin">
                  Capturar Foto
                </button>
                <button onClick={stopCamera} className="cancel-camera-button-profile-admin">
                  Cancelar
                </button>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
          </>
        )}
      </div>
      <div className="profile-info-profile-admin">
        {isEditing ? (
          <>
            <label>
              Nombre completo
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>
            <label>
              Apellido paterno
              <input
                type="text"
                value={app}
                onChange={(e) => setApp(e.target.value)}
              />
            </label>
            <label>
              Apellido materno
              <input
                type="text"
                value={apm}
                onChange={(e) => setApm(e.target.value)}
              />
            </label>
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Contraseña
              <div className="password-container-profile-admin">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="show-password-icon-profile-admin">
                  &#128065;
                </span>
              </div>
            </label>
            <div className="align">
              <button onClick={handleSave} className="save-button">
                GUARDAR
              </button>
              <button onClick={handleCancel} className="exit-button">
                CANCELAR
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="credentials-view-container">
              <h3>
                {nombre} {app} {apm}
              </h3>
              <p>Correo electrónico: {email}</p>
              <p>Contraseña: {password}</p>
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <button onClick={handleEditClick} className="save-button-profile-admin">
          Actualizar
        </button>
      )}
    </div>
  )
}

export default ProfileDocentDashboard
