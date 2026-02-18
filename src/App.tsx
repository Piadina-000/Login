import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import {Amministrazione} from './components/Amministrazione'
import { AggiungiBici } from './components/AggiungiBici'
import { ListaBici } from './components/ListaBici'
import './App.css'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<Amministrazione />} />
        <Route path='/aggiungiBici' element={<AggiungiBici />} />
        <Route path='/listaBici' element={<ListaBici />} />
      </Routes>
    </div>
  )
}

export default App
