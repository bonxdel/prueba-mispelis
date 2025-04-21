import React, {useState} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './componentes/Header'
import Favoritas from './componentes/Favoritas'
import Vistas from './componentes/Vistas'
import Nueva from './componentes/Nueva'
import Login from './componentes/Login'
import "./App.css"
import "./lib/font-awesome/css/all.min.css"

// Proporciona contexto global para compartir estados entre los componentes de la app
import { GlobalProvider } from './contexto/Contexto'


// Se invoca el contexto global con GlobalProvider
// Router permite navegar entre los diferentes componentes (routes)
// Cada ruta se corresponde con un componente específico
// Se incluye el componente "header" (cabecero que se muestra en todas las páginas) y las páginas/links que conforman la app
function App() {

  // Comprueba si hay un usuario loggeado para mostrar la info completa de la app
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false)

  return (
    <GlobalProvider>
      <Router>
        {usuarioAutenticado && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              usuarioAutenticado ? (
                <Navigate to="/" />
              ) : (
                <Login setUsuarioAutenticado={setUsuarioAutenticado} />
              )
            }
          />
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