import React, { useState, useEffect, useRef } from 'react'
import '../styles/login.css'

import { useNavigate } from 'react-router-dom';
import type { PostData, LoginResponse } from '../types';
import { authenticateLocalUser, getAuthResponse, saveAuthResponse } from '../service/service';

/**
 * Componente Login
 * Gestisce l'autenticazione dell'utente con:
 * - Form per email/username e password
 * - Validazione dei campi (formato email e lunghezza password)
 * - Autenticazione locale tramite user.json
 * - Salvataggio della sessione nel localStorage
 * - Supporto multilingua (IT/EN)
 */
export const Login = () => {
  // Stato per i dati del form (email/username e password)
  // Può essere inizializzato con valori di default
  //const [data, setData] = useState<PostData>({ email: "carmen@asistar.it", password: "pavesini123" });
  const [data, setData] = useState<PostData>({ email: "", password: "" });

  // Stato per la response di autenticazione (recuperata dal localStorage se presente)
  const [response, setResponse] = useState<LoginResponse | null>(() => getAuthResponse());

  // Ref per gli input 
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  
  // Stato per indicare se è in corso una richiesta di autenticazione
  const [loading, setLoading] = useState<boolean>(false);

  // Gestione degli errori: chiave di traduzione e messaggio personalizzato
  const [errorKey, setErrorKey] = useState<'errCredentials' | 'errNetwork' | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Stato per tracciare se l'utente ha interagito con i campi (per mostrare errori solo dopo l'interazione)
  const [touched, setTouched] = useState({ email: false, password: false });

  // Stato per sapere se l'utente è autenticato (verifica presenza dati nel localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getAuthResponse());
  const navigate = useNavigate();

  // Stato per la lingua dell'interfaccia (inglese o italiano)
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


  /**
   * Valida il formato dell'email
   * @param email - Stringa da validare
   * @returns true se il formato è valido 
   */
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Verifica che la password sia di almeno 8 caratteri
   * @param password - Password da validare
   * @returns true se la lunghezza è >= 8
   */
  const isValidPassword = (password: string) => password.length >= 8;

  /**
   * Reindirizza alla pagina admin quando l'utente è autenticato
   * Si attiva quando isLoggedIn diventa true
   */
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  /**
   * Salva automaticamente la response nel localStorage ogni volta che cambia
   * Se response è null, i dati vengono rimossi (logout)
   */
  useEffect(() => {
    try {
      saveAuthResponse(response);
    } catch (e) {
      console.error('Impossible to save to localStorage', e);
    }
  }, [response]);
  
  /**
   * Gestisce l'invio del form di login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Marca tutti i campi come "toccati" al submit per mostrare eventuali errori
    setTouched({ email: true, password: true });
    // Reset degli errori precedenti
    setErrorKey(null);
    setServerError(null);

    setLoading(true);
    try {
      // Autentica l'utente usando i dati locali da user.json
      const result = authenticateLocalUser(data);

      if (!result.ok) {
        // Credenziali errate: mostra messaggio di errore
        setErrorKey('errCredentials');
        setResponse(null);
        return;
      }

      // Autenticazione riuscita: salva i dati e imposta login
      setResponse(result.response as LoginResponse);
      setErrorKey(null);
      setServerError(null);
      setIsLoggedIn(true);
    } catch (err: any) {
      // Errore generico (es. problema con localStorage)
      console.error('AUTH ERROR:', err);
      setErrorKey('errNetwork');
    } finally {
      // Rimuove lo stato di loading in ogni caso
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
                onBlur={() => setTouched({...touched, email: true})}
                data-valid={validateEmail(data.email) ? "true" : "false"}
                className="email" 
                type="email" 
                placeholder={translations[lang].placeholders.email}
                aria-describedby={touched.email && !validateEmail(data.email) ? 'email-error' : undefined}
              />
              {touched.email && !validateEmail(data.email) && (
                <div id="email-error" className="field-error">{translations[lang].invalidEmail}</div>
              )}

              
              <input 
                id="password"
                ref={passwordRef}
                value={data.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, password: e.target.value})} 
                onBlur={() => setTouched({...touched, password: true})}
                data-valid={isValidPassword(data.password) ? "true" : "false"}
                className="password" 
                type="password" 
                placeholder={translations[lang].placeholders.password}
                aria-describedby={touched.password && !isValidPassword(data.password) ? 'password-error' : undefined}
              />
              {touched.password && !isValidPassword(data.password) && (
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
