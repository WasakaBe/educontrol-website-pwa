import './FamiliarDashboard.css'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface LocationState {
  user2?: string
}

const FamiliarDashboard: React.FC = () => {
  const location = useLocation()
  const state = location.state as LocationState
  const { user2 } = state || {}
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  return (
    <div className="admin-container-dashboard">
      <div className="admin-header">
        <h2>Dashboard Familiar</h2>
        <p>{formattedTime}</p>
      </div>
      <div className="admin-welcome">
        <p>
          Bienvenido, <span>{user2}</span>
        </p>
        <p>Es un gusto tenerte con nosotros. ¡Ánimo!</p>
      </div>
    </div>
  )
}

export default FamiliarDashboard
