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

        // Si no se encuentra el usuario, sale un aviso "Usuario no encontrado"
        if (!encontrado) {
            return respuesta.status(401).json({ error: "Usuario no encontrado" });
        }

        // Si la contraseña no coincide con la de la bd, sale el aviso "Contraseña incorrecta"
        if (encontrado.contraseña !== contraseña) {
            return respuesta.status(401).json({ error: "Contraseña incorrecta" });
        }

        conexion.close();
        respuesta.json({ mensaje: "Acceso concedido" });

    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});


// Añadir una peli con el tipo "favorita" a la bbdd
servidor.post("/pelifavorita", async (peticion, respuesta) => {
    const peli = peticion.body;
    try {
        const nueva = await guardarPeli(peli);
        respuesta.status(200).json(nueva);

    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor" });
    }
});


// Añadir una peli con el tipo "vista" a la bbdd
servidor.post("/pelivista", async (peticion, respuesta) => {
    const peli = peticion.body;
    try {
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