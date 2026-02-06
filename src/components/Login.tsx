import React, { useState } from 'react'
import '../App.css'

interface PostData {
      email: string;
      password: string;
  }

export const Login = () => {
  const [data, setData] = useState<PostData>({ email: "carmen@asistar.it", password: "admin12345" });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null)
  
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
          }
        } catch (err: any) {
        // network / fetch error
        console.error('Errore fetch:', err);
        setError(err?.message ?? String(err));
      } finally {
          setLoading(false);
      }
  };
    
/*
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleEmail=(event: any)=>{
    setEmail(event.target.value);
  }

  const handlePassword=(event: any)=>{
    setPassword(event.target.value);
  }

  const handleClick=()=>{
    console.log("Email: ", email);
    console.log("Password: ", password);
  }
  */

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
                className="email" 
                type="text" 
                placeholder='Inserisci nome utente o email'
              />
              <input 
                value={data.password}
                onChange={(e: any) => setData({...data, password: e.target.value})} 
                className="password" 
                type="password" 
                placeholder='Inserisci la password'
              />
            </div>
            <br />
            <div>
              <button 
                type="submit"
                className='submitButton'
                disabled={loading}>
                  {loading ? "Invio..." : "Login"}
              </button>
              <br />
              {error && <div className='error-message'>{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  )
}

//{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
