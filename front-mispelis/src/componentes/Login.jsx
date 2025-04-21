import React, { useState } from "react";

// Este componente nos permite el acceso a la app, SIN un usuario autenticado NO PODEMOS ACCEDER
function Login({ setUsuarioAutenticado }) {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // La constante "loggearse" es la acción del login, si accedemos al endpoint de nuestra API está autenticado
  // Se establecen errores en caso de ser incorrectos usuario o contraseña y en caso de no poder conectarse al servidor
  const loggearse = async (evento) => {
    evento.preventDefault();
    setError("");

    try {
      const respuesta = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contraseña: pass }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Acceso correcto
        setUsuarioAutenticado(true);
        localStorage.setItem("usuario", usuario);
      } else {
        // Error desde el backend por fallo de autenticación
        setError(datos.error || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      // Error de conexión
      setError("No se pudo conectar con el servidor");
    }
  };

  // Se devuelve la página de login con sus inputs y botón de acceso
  // Establecemos el acceso con OnChange
  // En caso de haberlo, el texto de error se muestra en rojo encima del botón "Acceder"
  return (
    <div className="pagina-login">
      <div className="contenedor">
        <h1 className="heading">Iniciar sesión</h1>
        <form onSubmit={loggearse}>
          <div className="campo">
            <label htmlFor="usuario">Usuario:</label>
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
          <button className="btn" type="submit">Acceder</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
