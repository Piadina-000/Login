import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='Login'>
        <div className='LoginBox'>
          <div className='LoginHeader'>
            <h1>Login</h1>
          </div>
          <div className='LoginBody'>
            <div className='inputs'>
              <input className="email" type="text" placeholder='Inserisci nome utente o email'/>
              <input className="password" type="password" placeholder='Inserisci la password'/>
            </div>
            <br />
            <div>
              <button className='submitButton'>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
