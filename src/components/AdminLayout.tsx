import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { getAuthResponse } from '../service/users'
import '../styles/afterLogin.css'

/**
 * AdminLayout
 * Layout condiviso per le pagine dell'area amministrativa.
 * - Mostra la `Sidebar` laterale
 */
export const AdminLayout = () => {
  const navigate = useNavigate()

  // Stato di caricamento: vero finché verifichiamo l'autenticazione
  const [isLoading, setIsLoading] = useState(true)

  // Verifica che l'utente sia autenticato al caricamento
  useEffect(() => {
    const saved = getAuthResponse()
    if (!saved) {
      // Nessuna autenticazione trovata => ritorno alla login
      navigate('/')
    }
    setIsLoading(false)
  }, [navigate])

  // Mostra un placeholder di caricamento mentre controlla l'autenticazione
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
