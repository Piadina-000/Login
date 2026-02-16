import React, { useState, useEffect, useRef } from 'react'
import '../styles/login.css'

import { useNavigate } from 'react-router-dom';
import type { PostData, LoginResponse } from '../types';

// Componente che gestisce il login.
// - Stato per email/password
// - Salvataggio su local storage di response
// - Validazione
// - Chiamata fetch
export const Login = () => {
  // Dati del form (email + password). Valori di esempio.
  const [data, setData] = useState<PostData>({ email: "carmen@asistar.it", password: "admin12345" });


  // saved response (typed)
  const [response, setResponse] = useState<LoginResponse | null>(() => {
    const saved = localStorage.getItem('response');
    return saved ? JSON.parse(saved) as LoginResponse : null;
  });

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // messaggi di errore: chiave di traduzione e messaggio server grezzo
  const [errorKey, setErrorKey] = useState<'errCredentials' | 'errNetwork' | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);


  // boolean per indicare se l'utente è autenticato
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!(localStorage.getItem('response')));
  const navigate = useNavigate();

  // stato per la lingua (en/it)
  const [lang, setLang] = useState<'en' | 'it'>('en');

  const translations = {
    en: {
      greeting: 'Morning!',
      subheading: 'To log in to your account, enter your email address and password.',
      placeholders: { email: 'Enter username or email', password: 'Enter password' },
      login: 'Login',
      loading: 'Loading...',
      invalidEmail: 'Invalid email address.',
      passwordTooShort: 'Password must be at least 8 characters long.',
      errCredentials: 'Incorrect email or password.',
      errNetwork: 'Network error. Please try again later.'
    },
    it: {
      greeting: 'Buongiorno!',
      subheading: "Per accedere al tuo account, inserisci la tua email e password.",
      placeholders: { email: 'Inserisci username o email', password: 'Inserisci la password' },
      login: 'Accedi',
      loading: 'Caricamento...',
      invalidEmail: 'Indirizzo email non valido.',
      passwordTooShort: 'La password deve essere di almeno 8 caratteri.',
      errCredentials: 'Email o password errati.',
      errNetwork: 'Errore di rete. Riprova più tardi.'
    }
  } as const;


  // funzione di validazione per l'email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // controllo minimo sulla password (>=8 caratteri)
  const isValidPassword = (password: string) => password.length >= 8;


  // se isLoggedIn diventa true, si sposta su /admin 
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  // passa il response al localStorage ogni volta che cambia, oppure lo rimuove se è null
  useEffect(() => {
    if (response) {
      try {
        localStorage.setItem('response', JSON.stringify(response));
      } catch (e) {
        console.error('Impossible to save to localStorage', e);
      }
    } else {
      localStorage.removeItem('response');
    }
  }, [response]);
  

  // gestione dell'invio del form (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);
    setServerError(null);

    setLoading(true);
    try {
      const res = await fetch('https://shiftcaller.it/api/mockup-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get('content-type') || '';
      let result: LoginResponse | string | null = null;
      if (contentType.includes('application/json')) {
        result = await res.json();
      } else {
        result = await res.text();
      }

      if (res.status === 401) {
        setErrorKey('errCredentials');
        setResponse(null);
        return;
      }

      if (!res.ok) {
        const serverMessage = (result && typeof result === 'object' && (result as any).message)
          ? (result as any).message
          : (typeof result === 'string' ? result : `Server error ${res.status}`);
        console.error('SERVER ERROR', res.status, result);
        setServerError(String(serverMessage));
        setResponse(null);
        return;
      }

      setResponse(result as LoginResponse);
      setErrorKey(null);
      setServerError(null);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('FETCH ERROR:', err);
      setErrorKey('errNetwork');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className='Login'>
        <div className='LoginBox'>
          <div className='LoginBody'>
            <div className='TopHeading'>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <p>Na</p>
                <p id='parteColorata'>me</p>
              </div>
              <div className='langSelect'>
                <select
                  id='languageSelect'
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en' | 'it')}
                  aria-label='Select language'
                >
                  <option value='en'>EN</option>
                  <option value='it'>IT</option>
                </select>
              </div>
            </div>
            <div className='LoginHeader'>
              <h1>{translations[lang].greeting}</h1>
              <p>{translations[lang].subheading}</p>
            </div>
            <div className='inputs'>

              <input
                id="email"
                ref={emailRef}
                value={data.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, email: e.target.value})}
                data-valid={validateEmail(data.email) ? "true" : "false"}
                className="email" 
                type="email" 
                placeholder={translations[lang].placeholders.email}
                aria-describedby={!validateEmail(data.email) ? 'email-error' : undefined}
              />
              {!validateEmail(data.email) && (
                <div id="email-error" className="field-error">{translations[lang].invalidEmail}</div>
              )}

              
              <input 
                id="password"
                ref={passwordRef}
                value={data.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, password: e.target.value})} 
                data-valid={isValidPassword(data.password) ? "true" : "false"}
                className="password" 
                type="password" 
                placeholder={translations[lang].placeholders.password}
                aria-describedby={!isValidPassword(data.password) ? 'password-error' : undefined}
              />
              {!isValidPassword(data.password) && (
                <div id="password-error" className="field-error">{translations[lang].passwordTooShort}</div>
              )}
            </div>
            <div>
              <button
                type="submit"
                className='submitButton'
                disabled={loading || !isValidPassword(data.password) || !validateEmail(data.email)}
                aria-busy={loading}
              >
                {loading ? translations[lang].loading : translations[lang].login}
              </button>
              {(serverError || errorKey) && (
                <div role="status" aria-live="polite" id="form-error" className='error-message'>
                  {serverError ?? (errorKey ? translations[lang][errorKey] : null)}
                </div>
              )}
            </div>
          </div> 
          <div className='footer'>
            <p>All rights reserved Asistar</p>
          </div>  
        </div> 
      </div>
      <div id='quadrato1'></div>
      <div id='quadrato2'></div>
      <div id='quadrato3'></div>
      <div id='quadrato4'></div>
      <div id='quadrato5'></div>
      <div id='quadrato6'></div>
      <div id='quadrato7'></div>

      <div id='barra1'></div>
      <div id='barra2'></div>
      <div id='bordoBarre'></div>
    </form>
    </>
    
  )
}

/*
<div id='hoverImg'>
    <h3>Something</h3>
</div>
*/

//per debug, mostra a schermo la risposta salvata su localStorage
//{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
