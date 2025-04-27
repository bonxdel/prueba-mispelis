import React, { useContext, useEffect } from "react"
import { Contexto } from "../contexto/Contexto"
import { Cartel } from "./Cartel"

function Favoritas(){
    // Extrae los valores "favoritas", "cargarFavoritas" y "usuario" del contexto global
    const {favoritas, cargarFavoritas, usuario} = useContext(Contexto)

    useEffect(() => {
        if (usuario) {
            cargarFavoritas(usuario);
        }
    }, [usuario, cargarFavoritas]); // Esto se ejecuta cuando haya usuario disponible

    // Devuelve la página "mis favoritas" con un header y un contador que muestra cuántas pelis hay guardadas
    // SI HAY FAVORITAS: se muestra el div "galeria-pelis" con los carteles de las pelis guardadas en favoritas
    // SI NO HAY FAVORITAS: se muestra el texto "no hay pelis :("
    return(
        <div className="pagina-pelis">
            <div className="contenedor">
                <div className="header">
                    <h1 className="heading">Mis favoritas</h1>

                    <span className="contador">{favoritas.length} {favoritas.length === 1 ? "peli" : "pelis"}</span>
                </div>

                {favoritas.length > 0 ? (
                    <div className="galeria-pelis">
                    {favoritas.map((peli) => (
                        <Cartel peli={peli} key={peli.id} tipo="favoritas"/>
                    ))}
                </div>) : (
                    <h2 className="no-pelis">No hay pelis :(</h2>
                )}
            </div>
        </div>
    )
}

export default Favoritas