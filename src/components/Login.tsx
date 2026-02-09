import React, { useState, useEffect} from 'react'
import '../styles/login.css'
import { useNavigate } from 'react-router-dom';
import type { PostData } from '../types';

// Componente che gestisce il login.
// - Stato per email/password
// - Salvataggio su local storage di response
// - Validazione
// - Chiamata fetch
export const Login = () => {
  // Dati del form (email + password). Valori di esempio.
  const [data, setData] = useState<PostData>({ email: "carmen@asistar.it", password: "admin12345" });

  // salvo la risposta del server
  const [response, setResponse] = useState<any>(() => {
    const saved = localStorage.getItem('response');
    return saved ? JSON.parse(saved) : null;
  });

  // messaggi di errore mostrati a schermo
  const [error, setError] = useState<string | null>(null)

  // boolean per indicare se l'utente è autenticato
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!(localStorage.getItem('response')));
  const navigate = useNavigate();


  // funzione di validazione per l'email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // controllo minimo sulla password (>=8 caratteri)
  const isValidPassword = data.password.length >= 8;


  // se isLoggedIn diventa true, si sposta su /admin 
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  // passa il response al localStorage
  useEffect(() => {
    if (response) {
      try {
        localStorage.setItem('response', JSON.stringify(response));
      } catch (e) {
        console.error('Impossibile salvare su localStorage', e);
      }
    } else {
      localStorage.removeItem('response');
    }
  }, [response]);
  

  // gestione dell'invio del form (POST)
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Se i dati non sono validi non inviare la richiesta
      if (!validateEmail(data.email) || !isValidPassword) {
        setError('Email o password non validi!');
        return;
      }

      try {
          const res = await fetch("https://shiftcaller.it/api/mockup-login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });
        const contentType = res.headers.get('content-type') || '';
        let result: any = null;
        if (contentType.includes('application/json')) {
          result = await res.json();
        } else {
          result = await res.text();
        }

        if (res.status === 401) {
          // mostro il messaggio per credenziali errate
          setError('CREDENZIALI ERRATE!');
          setResponse(null);
        } else if (!res.ok) {
          // mostrare l'errore server all'utente, se presente, altrimenti mostra solo un messaggio generico
          const serverMessage = (result && typeof result === 'object' && (result.message || result.error))
            ? (result.message || result.error)
            : (typeof result === 'string' ? result : `Errore server ${res.status}`);
          console.error('Errore server', res.status, result);
          setError(String(serverMessage));
          setResponse(result);
        } else {
          setResponse(result);
          setError(null);
          setIsLoggedIn(true);
        }
      } catch (err: any) {
        // network / fetch error
        console.error('Errore fetch:', err);
        setError(err?.message ?? String(err));
      } finally {
      }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className='Login'>
        <div className='LoginBox'>
          <div className='LoginHeader'>
            <h1>Login</h1>
          </div>
          <div className='LoginBody'>
            <div className='inputs'>
              <input
                value={data.email}
                onChange={(e: any) => setData({...data, email: e.target.value})}
                data-valid={validateEmail(data.email) ? "true" : "false"}
                className="email" 
                type="text" 
                placeholder='Inserisci nome utente o email'
              />
              {!validateEmail(data.email) && (
                <div className="field-error">Email non valida</div>
              )}
              <input 
                value={data.password}
                onChange={(e: any) => setData({...data, password: e.target.value})} 
                data-valid={isValidPassword ? "true" : "false"}
                className="password" 
                type="password" 
                placeholder='Inserisci la password'
              />
              {!isValidPassword && (
                <div className="field-error">La password deve avere almeno 8 caratteri</div>
              )}
            </div>
            <br />
            <div>
              <button
                  type="submit"
                  className='submitButton'
                  disabled={!isValidPassword || !validateEmail(data.email)}
                >
                  Login
                </button>
              <br />
              {error && <div className='error-message'>{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </form>
    {response && <pre className='response-debug'>{JSON.stringify(response, null, 2)}</pre>}
    </>
    
  )
}

//per debug, mostra a schermo la risposta salvata su localStorage
//{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
