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
            titulo: peli.title || peli.titulo,
        });

        if (existente) {
            // Si la peli ya existe, actualizamos los tipos
            const nuevosTipos = Array.from(new Set([...existente.tipo, ...peli.tipo]));
            console.log("Nuevos tipos:", nuevosTipos);

            await coleccion.updateOne(
                { _id: existente._id },
                { $set: { tipo: nuevosTipos } }
            );

            console.log("Película actualizada en la base de datos");
        } else {
            // Si no existe, insertamos la peli
            const resultado = await coleccion.insertOne(peli);
            peli._id = resultado.insertedId; // Aquí le asignamos el _id generado
            return peli; // Devolvemos el objeto peli completo con _id
        }

        return { mensaje: "Película guardada" };

    } catch (error) {
        console.error("Error:", error);
        return { error: "Error al guardar la peli" };
    } finally {
        if (cliente) await cliente.close();
    }
}




// NO FUNCIONA!
export function borrarPeli(id){
    return new Promise((ok, ko) => {
        MongoClient.connect(URL)
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
        .catch(() => {
            ko({ error: "error en base de datos" });
        });
    });
}