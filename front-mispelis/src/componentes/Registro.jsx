import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirigir


// Este componente nos permite registrar un nuevo usuario
function Registro({ setUsuarioAutenticado }) {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();


  // Función para validar el nombre de usuario y la contraseña
  const validarCampo = (campo) => {
    const caracteres = /^[a-zñA-Z0-9-_]+$/; // Solo permite letras, números, guiones y guiones bajos
    return caracteres.test(campo);
  };
  

  // La constante "registro" es la acción de crear el usuario, que accede al endpoint de nuestra API
  const registro = async (evento) => {
    evento.preventDefault();
    setError("");
    setExito("");

    // Valida que el nombre de usuario cumpla los requisitos
    if (!validarCampo(usuario)) {
      setError("El nombre de usuario solo puede contener letras, números, '-' y '_'");
      return;
    }
    
    // Valida que la contraseña cumpla los requisitos
    if (!validarCampo(pass)) {
      setError("La contraseña solo puede contener letras, números, '-' y '_'.");
      return;
    }

    try {
      // Realiza una solicitud POST a la API para registrar un nuevo usuario
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


  // Función para redirigir al formulario de login
  const irALogin = () => {
    navigate("/login");
  };


  return (
    <div className="pagina-registro">
      <div className="contenedor">
        <h1 className="heading">Crea tu cuenta</h1>
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
          <button className="btn" type="submit">Regístrate</button>
        </form>
        <button onClick={irALogin} className="btn">Accede</button>
      </div>
    </div>
  );
}

export default Registro;
