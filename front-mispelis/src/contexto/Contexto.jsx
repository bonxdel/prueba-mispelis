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
    const nuevaFav = (peli) => {
        dispatch({ type: "NUEVA_FAV", payload: peli });
    
        if (estado.usuario) {
            fetch("http://localhost:4000/pelifavorita", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: ["favorita"]
                }),
            })
            .then(respuesta => respuesta.json())
            .then(datos => console.log("✅ Peli guardada:", datos))
            .catch(error => console.error("❌ Error al guardar peli:", error));
        }
    };

    // Elimina una peli de tipo "favoritas"
    const borrarFav = (id) => {
        console.log(id);
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
    
    // Añade una nueva peli a "vistas"
    const nuevaVista = (peli) => {
        dispatch({ type: "NUEVA_VISTA", payload: peli });
    
        if (estado.usuario) {
            fetch("http://localhost:4000/pelivista", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...peli,
                    usuario: estado.usuario,
                    tipo: ["vista"],  // Asegúrate de incluir "vista" como tipo
                }),
            })
            .then(respuesta => respuesta.json())
            .then(datos => console.log("✅ Peli guardada como vista:", datos))
            .catch(error => console.error("❌ Error al guardar peli como vista:", error));
        }
    };
    
    // Cambia el tipo de categoría de "vista" a "favorita"
    const cambiarCategoria = (peli) => {
        dispatch({ type: "MOVER_A_FAVS", payload: peli });
    };

    // Elimina una peli "vista"
    const borrarVista = (id) => {
        dispatch({ type: "BORRAR_VISTA", payload: id });

        fetch(`http://localhost:4000/borrarpeli/${id}`, {
            method: "DELETE"
        })
        .then(respuesta => {
            if (respuesta.status === 204) {
                dispatch({ type: "BORRAR_PELI", payload: id });
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
