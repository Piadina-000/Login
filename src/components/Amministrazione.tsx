import { useEffect } from 'react'
import '../styles/amministrazione.css'
import { useNavigate } from 'react-router-dom'

// Pagina di amministrazione
export const Amministrazione = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const saved = localStorage.getItem('response')
        if (!saved) {
            // se non c'è nessun utente autenticato torna alla pagina di login
            navigate('/')
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('response')
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
                    <p>Benvenuto nell'area di amministrazione.</p>
                </div>
            </div>
        </div>
    )

    
}