import React, { useState } from 'react'
import './App.css'

interface PostData {
      email: string;
      password: string;
  }

function App() {
  const [data, setData] = useState<PostData>({ email: "carmen@asistar.it", password: "admin12345" });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
          const res = await fetch("https://shiftcaller.it/api/mockup-login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });
      const result = await res.json();
      setResponse(result);
      } catch (error) {
          setResponse({ error: "Errore" });
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
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  )
}

//{response && <pre>{JSON.stringify(response, null, 2)}</pre>}

export default App
