import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";

// Declaramos la constante que intenta obtener "usuario" (desde localStorage)
// Si no existe, asigna null como valor
const initialState = {
    usuario: localStorage.getItem("usuario") || null,
    favoritas: JSON.parse(localStorage.getItem("favoritas")) || [],
    vistas: JSON.parse(localStorage.getItem("vistas")) || [],
  };

// Crea un contexto global llamado "Contexto" con el estado inicial
// Esto permite compartir datos entre componentes sin pasar los props de manera manual
export const Contexto = createContext(initialState);

// Proveedor global del contexto que gestiona el estado de la app y sus funciones
export const GlobalProvider = (props) => {
    // Se crea el estado global usando useReducer, basado en AppReducer y el estado inicial
    const [estado, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        // Si hay un usuario logueado, se guardan sus datos en localStorage
        if (estado.usuario) {
            localStorage.setItem("favoritas", JSON.stringify(estado.favoritas));
            localStorage.setItem("vistas", JSON.stringify(estado.vistas));
            localStorage.setItem("usuario", estado.usuario);
        } else {
            // El usuario está vacío, lo que significa que el localStorage debería resetearse
            localStorage.removeItem("favoritas");
            localStorage.removeItem("vistas");
            localStorage.removeItem("usuario");
        }
    }, [estado.usuario]); // Solo se ejecuta cuando cambia el usuario

    // Gestiona el login de usuarios y lo guarda a nivel local
    const loginUsuario = async (usuario) => {
        // Limpiar los datos anteriores de localStorage
        localStorage.removeItem("favoritas");
        localStorage.removeItem("vistas");
        localStorage.removeItem("usuario");
    
        // Guardamos los datos del nuevo usuario
        dispatch({ type: "LOGIN", payload: usuario });
        localStorage.setItem("usuario", usuario);
    
        // Cargamos las películas de este usuario
        await cargarFavoritas(usuario);
        await cargarVistas(usuario);
    };
    

    // Guarda una peli como "favorita"
    const nuevaFav = (peli) => {
        if (estado.usuario) {
            fetch("http://localhost:4000/pelifavorita", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: "favorita",
                }),
            })
            .then(respuesta => respuesta.json()) 
            .then(datos => {
                dispatch({ type: "NUEVA_FAV", payload: datos });
            })
            .catch(error => {
                console.error("❌ Error al guardar peli:", error);
            });
        }
    };

    // Añade una nueva peli a "vistas"
    const nuevaVista = (peli) => {
        if (estado.usuario) {
            fetch("http://localhost:4000/pelivista", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: "vista",
                }),
            })
            .then(respuesta => respuesta.json()) 
            .then(datos => {
                dispatch({ type: "NUEVA_VISTA", payload: datos });
            })
            .catch(error => {
                console.error("❌ Error al guardar peli:", error);
            });
        }
    };

    // Elimina una peli de tipo "favoritas"
    const borrarFav = (id) => {
        // Se despacha acción para quitarla del estado
        dispatch({ type: "BORRAR_FAV", payload: id });

        // También se elimina del backend
        fetch(`http://localhost:4000/borrarpeli/${id}`, {
            method: "DELETE"
        })
        .then(respuesta => {
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_FAV", payload: id });
            } else {
                return respuesta.json().then(error => console.log(error));
            }
        })
        .catch(error => console.log(error));
    };

    // Elimina una peli "vista"
    const borrarVista = (id) => {
        // Se despacha acción para quitarla del estado
        dispatch({ type: "BORRAR_VISTA", payload: id });

        // También se elimina del backend
        fetch(`http://localhost:4000/borrarpeli/${id}`, {
            method: "DELETE"
        })
        .then(respuesta => {
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_VISTA", payload: id });
            } else {
                return respuesta.json().then(error => console.log(error));
            }
        })
        .catch(error => console.log(error));
    };

    // Cambia el tipo de categoría de "vista" a "favorita"
    const vistaToFav = async (peli) => {
        const nuevoTipo = peli.tipo.includes("favorita") ? "vista" : "favorita";

        // Se gestiona el cambio de categoría en el frontend
        dispatch({ type: "MOVER_A_FAVS", payload: { ...peli, tipo: nuevoTipo } });

        if (estado.usuario) {
            try {
                // Hacer la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo, // Enviar solo el nuevo tipo, NO un array
                    }),
                });

                // Verificar si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido');
                });

                // Actualizamos el estado con los datos del backend
                dispatch({ type: "MOVER_A_FAVS", payload: datos }); 
            } catch (error) {
                console.error("❌ Error al cambiar categoría de peli:", error);
            }
        }
    };

    // Cambia el tipo de categoría de "favorita" a "vista"
    const favToVista = async (peli) => {
        const nuevoTipo = peli.tipo.includes("vista") ? "favorita" : "vista";

        // Se gestiona el cambio de categoría en el frontend
        dispatch({ type: "MOVER_A_VISTAS", payload: { ...peli, tipo: nuevoTipo } });

        if (estado.usuario) {
            try {
                // Hacer la petición PUT al servidor de forma asíncrona
                const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo: nuevoTipo, // Enviar solo el nuevo tipo, NO un array
                    }),
                });

                // Verificar si la respuesta es JSON
                const datos = await respuesta.json().catch(() => {
                    throw new Error('La respuesta no es un JSON válido');
                });

                // Actualizamos el estado con los datos del backend
                dispatch({ type: "MOVER_A_VISTAS", payload: datos }); 
            } catch (error) {
                console.error("❌ Error al cambiar categoría de peli:", error);
            }
        }
    };

    // Cargar las pelis favoritas del usuario desde el backend
    const cargarFavoritas = async (usuario) => {
        if (usuario) {
            try {
                const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/favorita`);
                const datos = await respuesta.json();
                dispatch({ type: "CARGAR_FAVORITAS", payload: datos });
            } catch (error) {
                console.error("❌ Error cargando favoritas:", error);
            }
        }
    };
    
    // Cargar las pelis vistas del usuario desde el backend
    const cargarVistas = async (usuario) => {
        if (usuario) {
            try {
                const respuesta = await fetch(`http://localhost:4000/mispelis/${usuario}/vista`);
                const datos = await respuesta.json();
                dispatch({ type: "CARGAR_VISTAS", payload: datos });
            } catch (error) {
                console.error("❌ Error cargando vistas:", error);
            }
        }
    };


    // Devuelve el proveedor del contexto, que comparte estado y funciones globalmente
    return (
        <Contexto.Provider
            value={{
                favoritas: estado.favoritas,
                vistas: estado.vistas,
                usuario: estado.usuario,
                loginUsuario,
                nuevaFav,
                nuevaVista,
                borrarFav,
                borrarVista,
                vistaToFav,
                favToVista,
                cargarFavoritas,
                cargarVistas
            }}
        >
            {props.children}
        </Contexto.Provider>
    );
};
