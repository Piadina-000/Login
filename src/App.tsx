import { useState } from 'react'
import './App.css'

function App() {
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

  return (
    <>
      <div className='Login'>
        <div className='LoginBox'>
          <div className='LoginHeader'>
            <h1>Login</h1>
          </div>
          <div className='LoginBody'>
            <div className='inputs'>
              <input 
                onChange={(e: any) => handleEmail(e)} 
                className="email" 
                type="text" 
                placeholder='Inserisci nome utente o email'
              />
              <input 
                onChange={(e: any) => handlePassword(e)} 
                className="password" 
                type="password" 
                placeholder='Inserisci la password'
              />
            </div>
            <br />
            <div>
              <button 
                onClick={handleClick}
                className='submitButton'>
                  Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
