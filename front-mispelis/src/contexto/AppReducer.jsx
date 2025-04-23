// AppReducer gestiona el estado de mi app según las acciones; permite leer el estado actual y actualizarlo
// En este caso, lo utilizo para actualizar mis categorías de "favoritas" y "vistas" según las acciones que reciban

export default (estado, accion) => {
    switch(accion.type) {

        // Acción para añadir una nueva peli a "favoritas"
        case "NUEVA_FAV":
            return{
                ...estado, //se mantiene el estado anterior sin cambios
                favoritas: [accion.payload, ...estado.favoritas] //añade la nueva peli a la categoría "favoritas"
            }

        // Acción para eliminar una peli de "favoritas"
        case "BORRAR_FAV":
            return{
                ...estado,
                favoritas: estado.favoritas.filter(peli => peli._id !== accion.payload) //filtra la categoría "favoritas" eliminando la película con el ID seleccionado
            }

        // Acción para añadir una nueva peli a "vistas"
        case "NUEVA_VISTA":
            return {
                ...estado,
                favoritas: estado.favoritas.filter(peli => peli.id !== accion.payload.id), // Elimina la peli de "favoritas"
                vistas: [accion.payload, ...estado.vistas] // Añade la peli a "vistas"
            };
        

        // Acción para eliminar una peli de "vistas"
        case "BORRAR_VISTA":
            return{
                ...estado,
                vistas: estado.vistas.filter(peli => peli._id !== accion.payload) //filtra la categoría "vistas" eliminando la película con el ID seleccionado
            }

        // Acción para mover una peli de "vistas" a "favoritas"
        case "MOVER_A_FAVS":
            return {
                ...estado,
                vistas: estado.vistas.filter((peli) => peli._id !== accion.payload._id), // Elimina la peli de "vistas"
                favoritas: [
                    ...estado.favoritas.filter((peli) => peli._id !== accion.payload._id), // Elimina si ya estaba en "favoritas"
                    accion.payload, // Añade la peli a "favoritas"
                ],
            };         


        // Acción para mover una peli de "favoritas" a "vistas"
        case "MOVER_A_VISTAS":
            return {
                ...estado,
                favoritas: estado.favoritas.filter((peli) => peli._id !== accion.payload._id), // Elimina la peli de "favoritas"
                vistas: [
                    ...estado.vistas.filter((peli) => peli._id !== accion.payload._id), // Elimina si ya estaba en "vistas"
                    accion.payload, // Añade la peli a "vistas"
                ],
            };         
              
        // Acción para guardar el usuario cuando inicia sesión
        case "LOGIN":
            return {
                ...estado,
                usuario: accion.payload
            }
      

        // En caso de no hacer ninguna acción, se devuelve el estado actual              
        default:
            return estado
    }
}