import React, {useContext} from "react"
import { Contexto } from "../contexto/Contexto"

// Componente para mostrar los botones de acción en la página de pelis según su tipo ("favorita" o "vista")
export const Acciones = ({peli, tipo}) => {
    // Se invocan las funciones del contexto global para poder modificar las listas
    const {vistaToFav, borrarFav, favToVista, borrarVista} = useContext(Contexto)

    // Nos devuelve varias opciones: si la peli está en "favoritas", las opciones son añadir a "vistas" o eliminar
    // Si la peli está en "vistas", las opciones son añadir a "favoritas" o eliminar
    // En ambos casos se muestran dos iconos de font-awesome que activan la función al hacer click
    return(
        <div className="controles-pelis">
            {tipo === "favoritas" && (
                <>
                <button className="ctrl-btn" onClick={() => favToVista(peli)}>
                    <i className="fa-fw far fa-eye"></i>
                </button>

                <button className="ctrl-btn" onClick={() => borrarFav(peli._id)}>
                    <i className="fa-fw fa fa-times"></i>
                </button>
                </>
            )}

            {tipo === "vistas" && (
                <>
                <button className="ctrl-btn" onClick={() => vistaToFav(peli)}>
                    <i className="fa fa-heart"></i>
                </button>

                <button className="ctrl-btn" onClick={() => borrarVista(peli._id)}>
                    <i className="fa-fw fa fa-times"></i>
                </button>
                </>
            )}
        </div>
    )
}