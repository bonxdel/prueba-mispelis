import React from "react"
import {Link} from 'react-router-dom'

// Este elemento Header muestra el header que se verá en todas las páginas de la app
// El inicio es el nombre de la app (Mis Pelis)
// En la navegación tenemos las páginas "Favoritas", "Vistas" y un botón "+" que da acceso a la página "Nueva"
function Header(){

    return(
        <header>
            <div className="contenedor">
                <div className="contenido-header">
                    <div className="nombre-app">
                        <Link to="/favoritas">Mis Pelis</Link>
                    </div>
                    
                    <ul className="nav-links">
                        <li>
                            <Link to="/favoritas">Favoritas</Link>
                        </li>
                        <li>
                            <Link to="/vistas">Vistas</Link>
                        </li>
                        <li>
                            <Link to="/nueva" className="btn">+</Link>
                        </li>
                    </ul>
                </div>

            </div>
        </header>
    )
}

export default Header