import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './componentes/Header'
import Favoritas from './componentes/Favoritas'
import Vistas from './componentes/Vistas'
import Nueva from './componentes/Nueva'
import Login from './componentes/Login'
import Registro from './componentes/Registro'
import "./App.css"
import "./lib/font-awesome/css/all.min.css"

// Proporciona contexto global para compartir estados entre los componentes de la app
import { GlobalProvider } from './contexto/Contexto'

function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false)

  return (
    <Router>
      <GlobalProvider>
        {usuarioAutenticado && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              usuarioAutenticado ? (
                <Navigate to="/favoritas" />
              ) : (
                <Login setUsuarioAutenticado={setUsuarioAutenticado} />
              )
            }
          />

          <Route
            path="/registro"
            element={
              usuarioAutenticado ? (
                <Navigate to="/favoritas" />
              ) : (
                <Registro />
              )
            }
          />

          <Route
            path="/login"
            element={
              usuarioAutenticado ? (
                <Navigate to="/favoritas" />
              ) : (
                <Login setUsuarioAutenticado={setUsuarioAutenticado} />
              )
            }
          />

          <Route
            path="/favoritas"
            element={usuarioAutenticado ? <Favoritas /> : <Navigate to="/" />}
          />
          <Route
            path="/vistas"
            element={usuarioAutenticado ? <Vistas /> : <Navigate to="/" />}
          />
          <Route
            path="/nueva"
            element={usuarioAutenticado ? <Nueva /> : <Navigate to="/" />}
          />
        </Routes>
      </GlobalProvider>
    </Router>
  )
}

export default App