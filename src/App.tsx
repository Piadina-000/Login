import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { AdminLayout } from './components/AdminLayout'
import { Amministrazione } from './components/Amministrazione'
import { AggiungiBici } from './components/AggiungiBici'
import { ListaBici } from './components/ListaBici'
import './App.css'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Login />} />
        
        {/* Layout Admin con Sidebar condiviso */}
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<Amministrazione />} />
          <Route path='/listaBici' element={<ListaBici />} />
          <Route path='/aggiungiBici' element={<AggiungiBici />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
