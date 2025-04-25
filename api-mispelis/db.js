import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";

const urlMongo = process.env.DB_URL

async function conectar() {
    const cliente = new MongoClient(urlMongo);
    await cliente.connect();
    const db = cliente.db("mispelis");
    return { cliente, db };
}


// Exportación de la función asíncrona "guardarPeli" para usarla en el index.js
// Permite guardar pelis en la bbdd de Mongo Atlas
export async function guardarPeli(peli) {
    let cliente;

    try {
        const conexion = await conectar();
        cliente = conexion.cliente;
        const db = conexion.db;
        const coleccion = db.collection("pelis");

        const existente = await coleccion.findOne({
            usuario: peli.usuario,
            title: peli.title || peli.titulo,
        });

        if (existente) {
            // Si la peli ya existe, actualizamos los tipos
            const nuevosTipos = Array.from(new Set([...existente.tipo, ...peli.tipo]));

            await coleccion.updateOne(
                { _id: existente._id },
                { $set: { tipo: nuevosTipos } }
            );

        } else {
            // Si no existe, insertamos la peli
            const resultado = await coleccion.insertOne(peli);
            peli._id = resultado.insertedId; // Aquí le asignamos el _id generado
            return peli; // Devolvemos el objeto peli completo con _id
        }
        return { mensaje: "Película guardada" };

    } catch (error) {
        return { error: "Error al guardar la peli" };
    } finally {
        if (cliente) await cliente.close();
    }
}


// Función para cambiar la categoría de una peli (de "favorita" a "vista" o viceversa)
export async function cambiarCategoria(peli) {
    // Determinar el nuevo tipo basado en el tipo actual
    const nuevoTipo = peli.tipo.includes("favorita") ? "vista" : "favorita"; 

    // Despachar el cambio de categoría en el frontend
    dispatch({ type: "MOVER_A_FAVS", payload: { ...peli, tipo: [nuevoTipo] } });

    if (estado.usuario) {
        try {
            // Hacer la petición PUT al servidor de forma asíncrona
            const respuesta = await fetch(`http://localhost:4000/cambiarcategoria/${peli._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                tipo: nuevoTipo, // Enviar solo el nuevo tipo, reemplazando el anterior
                }),
            });

            // Esperar a que la respuesta sea convertida a JSON
            const datos = await respuesta.json();

            // Mostrar el resultado en consola y actualizar el estado
            dispatch({ type: "MOVER_A_FAVS", payload: datos }); // Actualizamos el estado con los datos del backend
        } catch (error) {
            console.error("❌ Error al cambiar categoría de peli:", error);
        }
    }
}


// Función para borrar pelis de la bd
export async function borrarPeli(id){
    return new Promise((ok, ko) => {
        MongoClient.connect(urlMongo)
        .then(conexion => {
            let coleccion = conexion.db("mispelis").collection("pelis");

            coleccion.deleteOne({ _id: new ObjectId(id) })
            .then(({ deletedCount }) => {
                conexion.close();
                ok(deletedCount);
            })
            .catch(() => {
                conexion.close();
                ko({ error: "error en base de datos" });
            });
        })
        .catch((error) => {
            console.error("Error en la base de datos:", error);
            conexion.close();
            ko({ error: "error en base de datos" });
        });
    });
}