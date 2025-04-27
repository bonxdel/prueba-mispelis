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
        console.error("Error al iniciar sesión:", error)
    }
}

    

    const logoutUsuario = () => {
            localStorage.clear()
            dispatch({ type: "LOGOUT" })
        }
        

    // Guarda una peli como "favorita"
    const nuevaFav = async (peli) => {
        if (!estado.usuario) return
        try{
            const respuesta = await fetch("http://localhost:4000/pelifavorita", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: "favorita" }),
                })
                const datos = await respuesta.json()
                dispatch({ type: "NUEVA_FAV", payload: datos })
            } catch (error) {
                console.error("❌ Error al guardar favorita:", error)
        }
    }


    // Añade una nueva peli a "vistas"
    const nuevaVista = async (peli) => {
        if (!estado.usuario) return
        try{
            const respuesta = await fetch("http://localhost:4000/pelivista", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: "vista" }),
                })
                const datos = await respuesta.json()
                dispatch({ type: "NUEVA_VISTA", payload: datos })
            } catch (error) {
                console.error("❌ Error al guardar vista:", error)
        }
    }


    // Elimina una peli de tipo "favoritas"
    const borrarFav = async (id) => {
        try {
            const respuesta = await fetch(`http://localhost:4000/borrarpeli/${id}`,
            {method: "DELETE"})
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_FAV", payload: id })
            }
        } catch(error) {
            console.error(error)
        }
    }


    // Elimina una peli "vista"
    const borrarVista = async (id) => {
        try {
            const respuesta = await fetch(`http://localhost:4000/borrarpeli/${id}`,
            {method: "DELETE"})
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_VISTA", payload: id })
            }
        } catch(error) {
            console.error(error)
        }
    }


    // Cambia el tipo de categoría de "vista" a "favorita"
    const vistaToFav = async (peli) => {
        const nuevoTipo = peli.tipo.includes("favorita") ? "vista" : "favorita"

        // Se gestiona el cambio de categoría en el frontend
        dispatch({ type: "MOVER_A_FAVS", payload: { ...peli, tipo: nuevoTipo } })

        if (estado.usuario) {
            try {
                // Hacer la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo, // Enviar solo el nuevo tipo, NO un array
                    }),
                })

                // Verificar si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido')
                })

                // Actualizamos el estado con los datos del backend
                dispatch({ type: "MOVER_A_FAVS", payload: datos }) 
            } catch (error) {
                console.error("❌ Error al cambiar categoría de peli:", error)
            }
        }
    }


    // Cambia el tipo de categoría de "favorita" a "vista"
    const favToVista = async (peli) => {
        const nuevoTipo = peli.tipo.includes("vista") ? "favorita" : "vista"

        // Se gestiona el cambio de categoría en el frontend
        dispatch({ type: "MOVER_A_VISTAS", payload: { ...peli, tipo: nuevoTipo } })

        if (estado.usuario) {
            try {
                // Hacer la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo, // Enviar solo el nuevo tipo, NO un array
                    }),
                })

                // Verificar si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido')
                })

                // Actualizamos el estado con los datos del backend
                dispatch({ type: "MOVER_A_VISTAS", payload: datos }) 
            } catch (error) {
                console.error("❌ Error al cambiar categoría de peli:", error)
            }
        }
    }


    // Cargar las pelis favoritas del usuario desde el backend
    const cargarFavoritas = async (usuario) => {
        if (!usuario) return
        try {
            const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/favorita`)
            const datos = await respuesta.json()
            dispatch({ type: "CARGAR_FAVORITAS", payload: datos })
        } catch (error) {
            console.error("❌ Error cargando favoritas:", error)
         }
    }


    // Cargar las pelis vistas del usuario desde el backend
    const cargarVistas = async (usuario) => {
        if (!usuario) return
        try {
            const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/vista`)
            const datos = await respuesta.json()
            dispatch({ type: "CARGAR_VISTAS", payload: datos })
        } catch (error) {
            console.error("❌ Error cargando vistas:", error)
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
