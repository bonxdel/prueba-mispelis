import React from "react"
import { Acciones } from "./Acciones"

export const Cartel = ({peli, tipo}) => {

    // Permite obtener el cartel de la peli guardada (o ninguno, si no tiene)
    // La última línea <Acciones etc/> invoca los botones y sus respectivos controles creados en Acciones.jsx
    return (
        <div className="cartel">
            {peli.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w400${peli.poster_path}`}
                    alt={`${peli.title} poster`} />
                ) : (
                    <div className="cartel-inexistente"></div>
                )}

                <Acciones tipo={tipo} peli={peli} />
        </div>
    )

}