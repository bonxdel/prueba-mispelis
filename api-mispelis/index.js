import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { guardarPeli, borrarPeli } from "./db.js";


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





// NO FUNCIONA! genera un id "undefined"
servidor.delete("/borrarpeli/:id([0-9a-f]{24})", async (peticion, respuesta) => {
    const { id } = peticion.params;
    console.log("ID recibido en el backend:", id);
    try {
        let count = await borrarPeli(id);

        if (count === 0) {
            return respuesta.status(404).json({ error: "Pelicula no encontrada" });
        }

        respuesta.status(204).send();
    } catch (error) {
        respuesta.status(500).json({ error: "error en el servidor" });
    }
});




servidor.listen(process.env.PORT);