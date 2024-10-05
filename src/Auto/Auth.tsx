import { createContext, useState, useEffect, ReactNode, FC } from 'react'

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export interface User {
  id_usuario: number
  nombre_usuario: string
  app_usuario: string
  apm_usuario: string
  phone_usuario: string
  correo_usuario: string
  pwd_usuario: string
  foto_usuario: string
  idRol: number
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
)

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedIsAuthenticated = localStorage.getItem('isAuthenticated')

      if (storedUser && storedIsAuthenticated) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(JSON.parse(storedIsAuthenticated))
      }
    } catch (error) {
      console.error(
        'Error al recuperar la información del usuario del localStorage:',
        error
      )
    }
  }, [])

  const login = (user: User) => {
    try {
      setUser(user)
      setIsAuthenticated(true)

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', JSON.stringify(true))
    } catch (error) {
      console.error(
        'Error al guardar la información del usuario en el localStorage:',
        error
      )
    }
  }

  const logout = () => {
    try {
      setUser(null)
      setIsAuthenticated(false)

      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      console.error(
        'Error al limpiar la información del usuario en el localStorage:',
        error
      )
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
