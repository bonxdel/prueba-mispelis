import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './componentes/Header'
import Favoritas from './componentes/Favoritas'
import Vistas from './componentes/Vistas'
import Nueva from './componentes/Nueva'
import Login from './componentes/Login' // Asegúrate de importar el componente Login
import Registro from './componentes/Registro' // Asegúrate de importar el componente Registro
import "./App.css"
import "./lib/font-awesome/css/all.min.css"

// Proporciona contexto global para compartir estados entre los componentes de la app
import { GlobalProvider } from './contexto/Contexto'

function App() {

  // Comprueba si hay un usuario loggeado para mostrar la info completa de la app
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false)

  return (
    <GlobalProvider>
      <Router>
        {usuarioAutenticado && <Header />}
        <Routes>
          {/* Página principal - Si el usuario no está autenticado, va a Login */}
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

          {/* Ruta de registro, accesible si el usuario no está autenticado */}
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

          {/* Ruta de login, accesible si el usuario no está autenticado */}
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

          {/* Páginas protegidas - solo accesibles si el usuario está autenticado */}
          <Route
            path="/favoritas"
            element={
              usuarioAutenticado ? <Favoritas /> : <Navigate to="/" />
            }
          />
          <Route
            path="/vistas"
            element={
              usuarioAutenticado ? <Vistas /> : <Navigate to="/" />
            }
          />
          <Route
            path="/nueva"
            element={
              usuarioAutenticado ? <Nueva /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  )
}

export default App
