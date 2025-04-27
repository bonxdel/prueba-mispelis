import React, { createContext, useReducer, useEffect } from "react"
import AppReducer from "./AppReducer"
import { useLocation } from "react-router-dom"


// En el estado inicial el usuario no está (hay que hacer login)
// LAs pelis favoritas y vistas son un array vacío hasta que se cargue la sesión
const initialState = {
    usuario: null,
    favoritas: [],
    vistas: [],
}


// Crea un contexto global llamado "Contexto" con el estado inicial
// Esto permite compartir datos entre componentes sin pasar los props de manera manual
export const Contexto = createContext(initialState)


// Proveedor global del contexto que gestiona el estado de la app y sus funciones
export const GlobalProvider = (props) => {


    // Se crea el estado global usando useReducer, basado en AppReducer y el estado inicial
    const [estado, dispatch] = useReducer(AppReducer, initialState)


    // Hook que permite acceder al objeto donde sea invocado en otro punto de la app
    const location = useLocation()


    useEffect(() => {
        // Se ejecuta cada vez que se accede a "/login"
        if (location.pathname !== "/login") {
            // Si la ruta actual NO es "/login", intenta obtener el usuario del localStorage
            const usuarioGuardado = localStorage.getItem("usuario")

            // Si hay un usuario guardado, se hace login
            if (usuarioGuardado) {
                dispatch({ type: "LOGIN", payload: usuarioGuardado })
            }
        } else {
            // Si se accede a la página de login, se borra la info del usuario anterior
            localStorage.removeItem("usuario")
        }
    }, [location.pathname]) // <-- este efecto depende de la ruta ACTUAL, se ejecuta cuando cambia
 

    useEffect(() => {
        // Se ejecuta cuando el estado del usuario cambia
        if (estado.usuario) {
            // Si hay un usuario en el estado, se cargan sus pelis favoritas y vistas
            cargarFavoritas(estado.usuario)
            cargarVistas(estado.usuario)
            }
    }, [estado.usuario]) // <-- este efecto depende del ESTADO del usuario, se ejecuta cuando cambia


    // Gestiona el login de usuarios y lo guarda a nivel local
    const loginUsuario = async (usuario) => {
        try {
            // Guarda el usuario en el localStorage
            localStorage.setItem("usuario", usuario)

            // Despacha la acción de login al reducer para actualizar el estado global
            dispatch({ type: "LOGIN", payload: usuario })

            // Carga las películas favoritas y vistas del usuario de manera simultánea
            await Promise.all([
                cargarFavoritas(usuario),
                cargarVistas(usuario),
            ])
        } catch (error) {
            console.error(error)
        }
    }
    

    // Gestiona el logout del usuario y vacía el localStorage
    const logoutUsuario = () => {
        localStorage.clear()
        dispatch({ type: "LOGOUT" })
    }
        

    // Guarda una peli como "favorita"
    const nuevaFav = async (peli) => {
    // Si NO hay un usuario en el estado, no se realiza ninguna acción
        if (!estado.usuario) return

        try {
        // Solicitud POST a la API para guardar la película como favorita
        const respuesta = await fetch("http://localhost:4000/pelifavorita", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...peli,
                usuario: estado.usuario,
                tipo: "favorita"
            }),
        })

        // Convierte la respuesta de la API en formato JSON
        const datos = await respuesta.json()

        // Despacha una acción para agregar la nueva película favorita al estado global
        dispatch({ type: "NUEVA_FAV", payload: datos })
        } catch (error) {
            console.error(error)
        }
    }


    // Añade una nueva peli a "vistas"
    const nuevaVista = async (peli) => {
        // Si NO hay un usuario en el estado, no se realiza ninguna acción
        if (!estado.usuario) return

        try {
            // Solicitud POST a la API para guardar la película como vista
            const respuesta = await fetch("http://localhost:4000/pelivista", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: "vista"
                }),
            })

            // Convierte la respuesta de la API en formato JSON
            const datos = await respuesta.json()

            // Despacha una acción para agregar la nueva película vista al estado global
            dispatch({ type: "NUEVA_VISTA", payload: datos })
        } catch (error) {
            console.error(error)
        }
    }

    // Elimina una peli de tipo "favorita"
    const borrarFav = async (id) => {
        try {
            // Realiza una solicitud DELETE a la API para eliminar la película favorita con el id
            const respuesta = await fetch(`http://localhost:4000/borrarpeli/${id}`, {
                method: "DELETE",
            })

            // Si la respuesta es 204, despacha la acción para eliminar la película del estado global
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_FAV", payload: id })
            }
        } catch (error) {
            console.error(error)
        }
    }


    // Elimina una peli "vista"
    const borrarVista = async (id) => {
        try {
            // Realiza una solicitud DELETE a la API para eliminar la película vista con el id
            const respuesta = await fetch(`http://localhost:4000/borrarpeli/${id}`, {
                method: "DELETE",
            })

            // Si la respuesta es 204, despacha la acción para eliminar la película del estado global
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_VISTA", payload: id })
            }
        } catch (error) {
            console.error(error)
        }
    }


    // Cambia el tipo de categoría de "vista" a "favorita"
    const vistaToFav = async (peli) => {
        const nuevoTipo = peli.tipo.includes("favorita") ? "vista" : "favorita"

        // Se gestiona el cambio de categoría según el reducer
        dispatch({ type: "MOVER_A_FAVS", payload: { ...peli, tipo: nuevoTipo } })

        if (estado.usuario) {
            try {
                // Hace la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo,
                    }),
                })

                // Verifica si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido')
                })

                // Actualiza el estado con los datos del backend
                dispatch({ type: "MOVER_A_FAVS", payload: datos }) 
            } catch (error) {
                console.error(error)
            }
        }
    }


    // Cambia el tipo de categoría de "favorita" a "vista"
    const favToVista = async (peli) => {
        const nuevoTipo = peli.tipo.includes("vista") ? "favorita" : "vista"

        // Se gestiona el cambio de categoría según el reducer
        dispatch({ type: "MOVER_A_VISTAS", payload: { ...peli, tipo: nuevoTipo } })

        if (estado.usuario) {
            try {
                // Hace la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo,
                    }),
                })

                // Verifica si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido')
                })

                // Actualiza el estado con los datos del backend
                dispatch({ type: "MOVER_A_VISTAS", payload: datos }) 
            } catch (error) {
                console.error(error)
            }
        }
    }


    // Carga de las pelis "favoritas" del usuario desde el backend
    const cargarFavoritas = async (usuario) => {
        // Si NO hay un usuario en el estado, no se realiza ninguna acción
        if (!usuario) return

        try {
        // Realiza una solicitud GET a la API para obtener las películas "favoritas" del usuario
        const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/favorita`)

        // Convierte la respuesta de la API en formato JSON
        const datos = await respuesta.json()

        // Despacha la acción para cargar las películas "favoritas" en el estado global
        dispatch({ type: "CARGAR_FAVORITAS", payload: datos })
        } catch (error) {
            console.error(error)
        }
    }


    // Carga de las pelis "vistas" del usuario desde el backend
    const cargarVistas = async (usuario) => {
        // Si NO hay un usuario en el estado, no se realiza ninguna acción
        if (!usuario) return

        try {
            // Realiza una solicitud GET a la API para obtener las películas "vistas" del usuario
            const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/vista`)

            // Convierte la respuesta de la API en formato JSON
            const datos = await respuesta.json()

            // Despacha la acción para cargar las películas "vistas" en el estado global
            dispatch({ type: "CARGAR_VISTAS", payload: datos })
        } catch (error) {
            console.error(error)
        }
    }    


    // Devuelve el proveedor del contexto, que comparte estado y funciones globalmente
    return (
        <Contexto.Provider
            value={{
                favoritas: estado.favoritas,
                vistas: estado.vistas,
                usuario: estado.usuario,
                loginUsuario,
                logoutUsuario,
                nuevaFav,
                nuevaVista,
                borrarFav,
                borrarVista,
                vistaToFav,
                favToVista,
                cargarFavoritas,
                cargarVistas,
            }}
        >
            {props.children}
        </Contexto.Provider>
    )
}
