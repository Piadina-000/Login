import { useEffect, useState } from 'react'
import '../styles/amministrazione.css'
import { useNavigate } from 'react-router-dom'
import type { LoginResponse } from '../types'
import { clearAuthResponse, getAuthResponse } from '../service/service'

/**
 * Componente Amministrazione
 * Pagina protetta che mostra i dati dell'utente autenticato.
 * Se l'utente non è autenticato, viene reindirizzato alla pagina di login.
 */
export const Amministrazione = () => {
    const navigate = useNavigate()
    // Inizializza lo stato con i dati di autenticazione salvati nel localStorage
    const [auth, setAuth] = useState<LoginResponse | null>(() => getAuthResponse())

    // Verifica all'avvio del componente se l'utente è autenticato
    useEffect(() => {
        const saved = getAuthResponse()
        if (!saved) {
            // Se non c'è nessun utente autenticato, reindirizza alla pagina di login
            navigate('/')
        } else {
            // Altrimenti, imposta i dati dell'utente nello stato
            setAuth(saved)
        }
    }, [navigate])

    /**
     * Gestisce il logout dell'utente
     * Cancella i dati dal localStorage e reindirizza al login
     */
    const handleLogout = () => {
        clearAuthResponse()
        navigate('/')
    }

    /*
    //per debug, mostra a schermo la risposta salvata su localStorage
  
    const saved = localStorage.getItem('response')
    const parsed = saved ? JSON.parse(saved) : null
    
    {parsed && (
        <pre className='response-debug'>{JSON.stringify(parsed, null, 2)}</pre>
    )}
    */

    return (
        <div className='amministrazione'>
            <div className='header'>
                <h1>Amministrazione</h1>
                <button className='logoutButton' onClick={handleLogout}>Logout</button>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <h2>Benvenuto nell'area di amministrazione</h2>
                    {auth?.user && (
                        <div className='user-info'>
                            {auth.user.nome && <p><strong>Nome:</strong> {auth.user.nome}</p>}
                            {auth.user.cognome && <p><strong>Cognome:</strong> {auth.user.cognome}</p>}
                            {auth.user.email && <p><strong>Email:</strong> {auth.user.email}</p>}
                            {auth.user.usrname && <p><strong>Username:</strong> {auth.user.usrname}</p>}
                            {auth.user.indirizzo && <p><strong>Indirizzo:</strong> {auth.user.indirizzo}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    
}