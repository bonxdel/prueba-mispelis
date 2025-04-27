// AppReducer gestiona el estado de mi app según las acciones; permite leer el estado actual y actualizarlo

export default (estado, accion) => {
    switch(accion.type) {

        // Acción para añadir una nueva peli a "favoritas"
        case "NUEVA_FAV":
            return{
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Añade la nueva peli a la categoría "favoritas"
                favoritas: [accion.payload, ...estado.favoritas]
            }


        // Acción para eliminar una peli de "favoritas"
        case "BORRAR_FAV":
            return{
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Filtra la categoría "favoritas" eliminando la película con el ID seleccionado
                favoritas: estado.favoritas.filter(peli => peli._id !== accion.payload)
            }


        // Acción para añadir una nueva peli a "vistas"
        case "NUEVA_VISTA":
            return {
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Añade la peli a "vistas"
                vistas: [accion.payload, ...estado.vistas]
            }
        

        // Acción para eliminar una peli de "vistas"
        case "BORRAR_VISTA":
            return{
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Filtra la categoría "vistas" eliminando la película con el ID seleccionado
                vistas: estado.vistas.filter(peli => peli._id !== accion.payload) 
            }


        // Acción para mover una peli de "vistas" a "favoritas"
        case "MOVER_A_FAVS":
            return {
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Elimina la peli de "vistas"
                vistas: estado.vistas.filter((peli) => peli._id !== accion.payload._id),
                favoritas: [
                    // Elimina si ya estaba en "favoritas"
                    ...estado.favoritas.filter((peli) => peli._id !== accion.payload._id),
                    // Añade la peli a "favoritas"
                    accion.payload,
                ],
            }


        // Acción para mover una peli de "favoritas" a "vistas"
        case "MOVER_A_VISTAS":
            return {
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Elimina la peli de "favoritas"
                favoritas: estado.favoritas.filter((peli) => peli._id !== accion.payload._id),
                vistas: [
                    // Elimina si ya estaba en "vistas"
                    ...estado.vistas.filter((peli) => peli._id !== accion.payload._id),
                    // Añade la peli a "vistas"
                    accion.payload,
                ],
            }   
        
            
        // Acción para guardar el usuario cuando inicia sesión
        case "LOGIN":
            return {
                // Se mantiene el estado anterior sin cambios
                ...estado,
                // Se obtiene el usuario
                usuario: accion.payload,
                favoritas: JSON.parse(localStorage.getItem("favoritas")) || [],
                vistas: JSON.parse(localStorage.getItem("vistas")) || []
            }


        // Carga de pelis "favoritas"
        case "CARGAR_FAVORITAS":
            return {
                ...estado,
                favoritas: accion.payload,
            }


        // Carga de pelis "vistas"
        case "CARGAR_VISTAS":
            return {
                ...estado,
                vistas: accion.payload,
            }
 
            
        // Acción para vaciar la info del usuario al recargar (logout)
        case "LOGOUT":
            return {
                usuario: null,
                favoritas: [],
                vistas: [],
            }

            
        // Vaciado de pelis
        case "RESET_PELIS":
            return {
                ...estado,
                favoritas: [],
                vistas: [],
            }

            
        // En caso de no hacer ninguna acción, se devuelve el estado actual              
        default:
            return estado
    }
}