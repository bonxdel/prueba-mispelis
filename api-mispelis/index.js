import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { guardarPeli, borrarPeli, cambiarCategoria } from "./db.js";


dotenv.config();

const urlMongo = process.env.DB_URL;
const servidor = express();

servidor.use(cors());
servidor.use(express.json());

// Gestión del login de usuarios
servidor.post("/login", async (peticion, respuesta) => {
    const { usuario, contraseña } = peticion.body;

    try {
        const conexion = await MongoClient.connect(urlMongo);
        const baseDatos = conexion.db("mispelis");
        const usuarios = baseDatos.collection("usuariosmp");

        const encontrado = await usuarios.findOne({ usuario });

        if (!encontrado) {
            return respuesta.status(400).json({ error: "Usuario no encontrado" });
        }

        if (encontrado.contraseña !== contraseña) {
            return respuesta.status(400).json({ error: "Contraseña incorrecta" });
        }

        conexion.close();
        respuesta.json({ mensaje: "Acceso concedido", usuario: encontrado.usuario });

    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});


servidor.get("/mispelis", async (peticion, respuesta) => {
    const { usuario } = peticion.body;

    if (!usuario) {
        return respuesta.status(400).json({ error: "Usuario no autenticado" });
    }

    try {
        const conexion = await MongoClient.connect(urlMongo);
        const baseDatos = conexion.db("mispelis");
        const coleccion = baseDatos.collection("pelis");

        const peliculas = await coleccion.find({ usuario }).toArray();
        respuesta.json(peliculas);

        conexion.close();
    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});



// Añadir una peli con el tipo "favorita" a la bbdd
servidor.post("/pelifavorita", async (peticion, respuesta) => {
    const peli = peticion.body;
    const { usuario } = peticion.body; // Recibimos el usuario desde el cuerpo de la solicitud

    if (!usuario) {
        return respuesta.status(400).json({ error: "Usuario no autenticado" });
    }

    try {
        // Asocia la peli al usuario logueado
        peli.usuario = usuario;
        const nueva = await guardarPeli(peli);
        respuesta.status(200).json(nueva);
    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});



// Añadir una peli con el tipo "vista" a la bbdd
servidor.post("/pelivista", async (peticion, respuesta) => {
    const peli = peticion.body;
    const { usuario } = peticion.body; // Recibimos el usuario desde el cuerpo de la solicitud

    if (!usuario) {
        return respuesta.status(400).json({ error: "Usuario no autenticado" });
    }

    try {
        // Asocia la peli al usuario logueado
        peli.usuario = usuario;
        const nueva = await guardarPeli(peli);
        respuesta.status(200).json(nueva);
    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});




// Actualizar el tipo de una peli (favorita <-> vista)
servidor.put("/cambiarcategoria/:id([0-9a-f]{24})", async (peticion, respuesta) => {
    const { tipo } = peticion.body;
    const { id } = peticion.params;

    const cliente = await MongoClient.connect(urlMongo);
    const db = cliente.db("mispelis");
    const coleccion = db.collection("pelis");

    try {
        const peliActualizada = await coleccion.updateOne(
            { _id: new ObjectId(id) },
            { $set: { tipo: tipo } }
        );

        if (peliActualizada.modifiedCount === 1) {
            const peli = await coleccion.findOne({ _id: new ObjectId(id) });
            console.log("Peli actualizada:", peli); // Agregar log para verificar
            respuesta.json(peli);
        } else {
            respuesta.status(404).send("Película no encontrada");
        }
    } catch (error) {
        console.error("Error al actualizar la categoría de la película:", error); // Agregar log de error
        respuesta.status(500).send("Error al actualizar la categoría de la película");
    }
});


// 
servidor.delete("/borrarpeli/:id([0-9a-f]{24})", async (peticion, respuesta) => {    
    const { id } = peticion.params;
    try {
        let count = await borrarPeli(id);

        if (count === 0) {
            return respuesta.status(404).json({ error: "Peli no encontrada" });
        }

        respuesta.status(204).send();
    } catch (error) {
        respuesta.status(500).json({ error: "error en el servidor" });
    }
});




servidor.listen(process.env.PORT);