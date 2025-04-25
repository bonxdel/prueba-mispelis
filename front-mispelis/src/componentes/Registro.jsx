import React, { useState } from "react";

// Este componente nos permite registrar un nuevo usuario
function Registro({ setUsuarioAutenticado }) {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Función para validar el nombre de usuario y la contraseña
  const validarCampo = (campo) => {
    const regex = /^[a-zA-Z0-9-_]+$/; // Solo permite letras, números, guiones y guiones bajos
    return regex.test(campo);
  };

  // La constante "registro" es la acción de crear el usuario, que accede al endpoint de nuestra API
  const registro = async (evento) => {
    evento.preventDefault();
    setError("");
    setExito("");

    // Validar que el nombre de usuario y la contraseña cumplan con los requisitos
    if (!validarCampo(usuario)) {
      setError("El nombre de usuario solo puede contener letras, números, '-' y '_'.");
      return;
    }
    
    if (!validarCampo(pass)) {
      setError("La contraseña solo puede contener letras, números, '-' y '_'.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:4000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contraseña: pass }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Registro ok
        setExito("¡Nueva cuenta creada!");
        setUsuario("");
        setPass("");
      } else {
        // Error desde el backend por problemas con el registro
        setError(datos.error || "Error al registrar");
      }
    } catch (error) {
      // Error de conexión
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="pagina-registro">
      <div className="contenedor">
        <h1 className="heading">Regístrate</h1>
        <form onSubmit={registro}>
          <div className="campo">
            <label htmlFor="usuario">Nombre de usuario:</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="pass">Contraseña:</label>
            <input
              type="password"
              id="pass"
              value={pass}
              onChange={(evento) => setPass(evento.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {exito && <p style={{ color: "green" }}>{exito}</p>}
          <button className="btn" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
