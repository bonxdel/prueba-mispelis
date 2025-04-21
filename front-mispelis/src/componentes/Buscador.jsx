import React, {useContext} from "react"
import {Contexto} from '../contexto/Contexto'

function Buscador ({peli}){
    // Se invocan las funciones del contexto global para poder modificar las listas
    const {nuevaFav, nuevaVista, favoritas, vistas} = useContext(Contexto)

    // Se crean las variables que confirman si una peli está añadida a "favoritas" o a "vistas"
    let peliFav = favoritas.find((item) => item.id === peli.id)
    let peliVista = vistas.find((item) => item.id === peli.id)


    // Estas constantes hacen que los botones de añadir se desactiven si la peli ya está guardada como "favorita" o "vista"
    const favoritasDisabled = peliFav ? true : peliVista ? true : false
    const vistasDisabled = peliVista ? true : peliFav ? true : false


    // Devuelve los resultados que se mostrarían después de hacer la búsqueda en el input (Nueva.jsx)
    // Muestra el cartel de la peli según la API de TMDB (o ningún cartel, si no tiene)
    // También muestra info sobre la peli: el título y la fecha de estreno, que se ha limitado a solo el año, o "-" si no se especifica en TMDB
    // Posteriormente tenemos controles para añadir las pelis como "favorita" o "vista" al hacer click
    // Estos botones pueden estar desactivados si la peli ya está guardada en alguna de las dos categorías
    return(
        <div className="cartel-buscador">
            <div className="contenedor-cartel">
                {peli.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${peli.poster_path}`}
                    alt={`${peli.title} poster`} />
                ) : (
                    <div className="cartel-inexistente"></div>
                )}
            </div>
            <div className="info">
                <div className="header">
                    <h3 className="titulo-peli">{peli.title}</h3>
                    <h4 className="fecha-estreno">
                        {peli.release_date ? peli.release_date.substring(0,4) : "-"}
                    </h4>
                </div>
                
                <div className="controles-buscador">
                    <button className="btn"
                    disabled={favoritasDisabled}
                    onClick={() => nuevaFav(peli)}>Favorita</button>

                    <button className="btn"
                    disabled={vistasDisabled}
                    onClick={() => nuevaVista(peli)}>Vista</button>
                </div>
            </div>
        </div>
    )
}

export default Buscador