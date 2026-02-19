import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { getAuthResponse } from '../service/service'
import '../styles/afterLogin.css'

/**
 * Layout AdminLayout
 * Fornisce il layout condiviso per tutte le pagine di amministrazione
 * Contiene la Sidebar e il contenuto principale
 */
export const AdminLayout = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  // Verifica che l'utente sia autenticato al caricamento
  useEffect(() => {
    const saved = getAuthResponse()
    if (!saved) {
      navigate('/')
    }
    setIsLoading(false)
  }, [navigate])

  if (isLoading) {
    return <div className="admin-layout__loading">Caricamento...</div>
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
