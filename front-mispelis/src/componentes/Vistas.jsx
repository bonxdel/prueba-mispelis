import React, { useContext, useEffect } from "react"
import { Contexto } from "../contexto/Contexto"
import { Cartel } from "./Cartel"

function Vistas(){
    // Extrae los valores "vistas", "cargarVistas" y "usuario" del contexto global
    const {vistas, cargarVistas, usuario} = useContext(Contexto)

    useEffect(() => {
        if (usuario) {
            cargarVistas(usuario);
        }
    }, [usuario, cargarVistas]); // Se ejecuta cuando haya usuario disponible

    // Devuelve la página "pelis vistas" con un header y un contador que muestra cuántas pelis hay guardadas
    // SI HAY VISTAS: se muestra el div "galeria-pelis" con los carteles de las pelis guardadas en vistas
    // SI NO HAY VISTAS: se muestra el texto "no hay pelis :("
    return(
        <div className="pagina-pelis">
            <div className="contenedor">
                <div className="header">
                    <h1 className="heading">Pelis vistas</h1>
                
                    <span className="contador">{vistas.length} {vistas.length === 1 ? "peli" : "pelis"}</span>
                </div>

                {vistas.length > 0 ? (
                    <div className="galeria-pelis">
                    {vistas.map((peli) => (
                        <Cartel peli={peli} key={peli.id} tipo="vistas"/>
                    ))}
                </div>) : (
                    <h2 className="no-pelis">No hay pelis :(</h2>
                )}
            </div>
        </div>
    )
}

export default Vistas