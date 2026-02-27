import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { getAuthResponse } from '../service/users'
import '../styles/afterLogin.css'

/**
 * AdminLayout
 * 
 * Layout condiviso per tutte le pagine dell'area amministrativa.
 * 
 * Funzionalità principali:
 * - Verifica della sessione utente all'avvio
 * - Reindirizzamento automatico al login se non autenticato
 * - Mostra placeholder durante la verifica dell'autenticazione
 * 
 * Struttura:
 * - Sidebar: menu di navigazione laterale fisso
 * - Main: area contenuto che cambia in base alla rotta (Dashboard, Biciclette, ecc.)
 */
export const AdminLayout = () => {
  const navigate = useNavigate()

  // Stato di caricamento: true finché non verifichiamo l'autenticazione
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Verifica l'autenticazione al caricamento del componente
   * Se non trova dati di autenticazione nel localStorage, reindirizza alla pagina di login
   * Altrimenti, permette l'accesso all'area amministrativa
   */
  useEffect(() => {
    const saved = getAuthResponse()
    if (!saved) {
      // Nessuna autenticazione trovata => ritorno alla login
      navigate('/')
    }
    setIsLoading(false)
  }, [navigate])

  /**
   * Mostra un placeholder durante il controllo dell'autenticazione
   */
  if (isLoading) {
    return <div className="admin-layout__loading">Caricamento...</div>
  }

  /**
   * Layout principale strutturato a due colonne:
   * - Sidebar: menu di navigazione laterale
   * - Main: area contenuto
   */
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
