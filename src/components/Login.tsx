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
    setError(null);

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
        setError('Incorrect email or password.');
        setResponse(null);
        return;
      }

      if (!res.ok) {
        const serverMessage = (result && typeof result === 'object' && (result as any).message)
          ? (result as any).message
          : (typeof result === 'string' ? result : `Server error ${res.status}`);
        console.error('SERVER ERROR', res.status, result);
        setError(String(serverMessage));
        setResponse(null);
        return;
      }

      setResponse(result as LoginResponse);
      setError(null);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('FETCH ERROR:', err);
      setError('Network error. Please check your connection.');
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
              <p>Na</p>
              <p id='parteColorata'>me</p>
              <input id="languageButton" type="button" value="EN ▼" />
            </div>
            <div className='LoginHeader'>
              <h1>Morning!</h1>
              <p>To log in to your account, enter your email address and password.</p>
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
                placeholder='Enter username or email'
                aria-describedby={!validateEmail(data.email) ? 'email-error' : undefined}
              />
              {!validateEmail(data.email) && (
                <div id="email-error" className="field-error">Invalid email address</div>
              )}

              
              <input 
                id="password"
                ref={passwordRef}
                value={data.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, password: e.target.value})} 
                data-valid={isValidPassword(data.password) ? "true" : "false"}
                className="password" 
                type="password" 
                placeholder='Enter password'
                aria-describedby={!isValidPassword(data.password) ? 'password-error' : undefined}
              />
              {!isValidPassword(data.password) && (
                <div id="password-error" className="field-error">Password must be at least 8 characters long.</div>
              )}
            </div>
            <br />
            <div>
              <button
                type="submit"
                className='submitButton'
                disabled={loading || !isValidPassword(data.password) || !validateEmail(data.email)}
                aria-busy={loading}
              >
                {loading ? 'Caricamento...' : 'Login'}
              </button>
              <br />
              {error && (
                <div role="status" aria-live="polite" id="form-error" className='error-message'>
                  {error}
                </div>
              )}
            </div>
          </div> 
          <div className='footer'>
            <p>All rights reserved ...</p>
          </div>  
        </div> 
      </div>
      <div className='quadrato1'></div>
      <div className='quadrato2'></div>
      <div className='quadrato3'></div>
      <div className='quadrato4'></div>
      <div className='quadrato5'></div>
      <div className='quadrato6'></div>
      <div className='quadrato7'></div>

      <div className='barra1'></div>
      <div className='barra2'></div>
      <div className='bordoBarre'></div>
    </form>
    </>
    
  )
}

/*
<div className='hoverImg'>
    <h3>Something</h3>
</div>
*/

//per debug, mostra a schermo la risposta salvata su localStorage
//{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
