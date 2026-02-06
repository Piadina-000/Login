import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import {Amministrazione} from './components/Amministrazione'
import './App.css'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<Amministrazione />} />
      </Routes>
    </div>
  )
}

export default App
