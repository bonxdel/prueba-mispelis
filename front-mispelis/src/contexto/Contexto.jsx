import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";

const initialState = {
    favoritas: localStorage.getItem("favoritas")
        ? JSON.parse(localStorage.getItem("favoritas"))
        : [],
    vistas: localStorage.getItem("vistas")
        ? JSON.parse(localStorage.getItem("vistas"))
        : [],
    usuario: localStorage.getItem("usuario") || null,
};

export const Contexto = createContext(initialState);

export const GlobalProvider = (props) => {
    const [estado, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        if (estado.usuario) {
            localStorage.setItem("favoritas", JSON.stringify(estado.favoritas));
            localStorage.setItem("vistas", JSON.stringify(estado.vistas));
            localStorage.setItem("usuario", estado.usuario);
        }
    }, [estado]);

    // Guarda una peli como "favorita"
// Guarda una peli como "favorita"
// Guarda una peli como "favorita"
const nuevaFav = (peli) => {
    if (estado.usuario) {
        fetch("http://localhost:4000/pelifavorita", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...peli,
                usuario: estado.usuario,
                tipo: "favorita",  // Se asegura de que tipo sea una cadena
            }),
        })
        .then(respuesta => respuesta.json()) 
        .then(datos => {
            console.log("✅ Peli guardada:", datos);
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
        fetch("http://localhost:4000/cambiarcategoria/" + peli._id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tipo: "vista"  // Solo un valor, no un array
            }),
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log("✅ Peli movida a vista:", datos);
            dispatch({ type: "NUEVA_VISTA", payload: datos });
        })
        .catch(error => console.error("❌ Error al cambiar categoría de peli:", error));
    }
};




    // Elimina una peli de tipo "favoritas"
    const borrarFav = (id) => {
        dispatch({ type: "BORRAR_FAV", payload: id });

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

// Cambia el tipo de categoría de "vista" a "favorita"
const cambiarCategoria = async (peli) => {
    const nuevoTipo = peli.tipo.includes("favorita") ? "vista" : "favorita";

    // Despachar el cambio de categoría en el frontend
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
            const datos = await respuesta.json().catch((e) => {
                throw new Error('La respuesta no es un JSON válido');
            });

            console.log(`✅ Peli movida a ${nuevoTipo}:`, datos);
            dispatch({ type: "MOVER_A_FAVS", payload: datos }); // Actualizamos el estado con los datos del backend
        } catch (error) {
            console.error("❌ Error al cambiar categoría de peli:", error);
        }
    }
};


    // Elimina una peli "vista"
    const borrarVista = (id) => {
        dispatch({ type: "BORRAR_VISTA", payload: id });

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

    // Gestiona el login de usuarios y lo guarda a nivel local
    const loginUsuario = (usuario) => {
        dispatch({ type: "LOGIN", payload: usuario });
        localStorage.setItem("usuario", usuario); 
    };

    return (
        <Contexto.Provider
            value={{
                favoritas: estado.favoritas,
                vistas: estado.vistas,
                usuario: estado.usuario,
                nuevaFav,
                borrarFav,
                nuevaVista,
                cambiarCategoria,
                borrarVista,
                loginUsuario
            }}
        >
            {props.children}
        </Contexto.Provider>
    );
};
