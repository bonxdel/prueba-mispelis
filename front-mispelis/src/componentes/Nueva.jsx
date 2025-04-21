import React, {useState} from "react"
import Buscador from "./Buscador"

// Esta función nos permite añadir nuevas pelis a nuestra base de datos
function Nueva(){

    // Estados que permiten almacenar info
    // "Texto" permite guardar el texto escrito en el input del buscador
    // "Resultados" permite guardar los resultados de la búsqueda (array)
    const [texto, setTexto] = useState("")
    const [resultados, setResultados]= useState([])

    // Acceso a la API de TMDB para recibir los datos necesarios de nuestras pelis
    // Se accede al hacer un cambio en el input (onChange)
    // Se recogen los datos de la API externa y se transcriben a JSON para poder mostrarlos
    const onChange = evento => {
        evento.preventDefault()

        setTexto(evento.target.value)

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=es-SP&page=1&include_adult=false&query=${evento.target.value}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if(!datos.error) {
                setResultados(datos.results)
            } else{
                setResultados([])
            }
        })

    }

    // Sespués de acceder a la info de la API, nos devuelve:
    // Un input de tipo texto que funciona como buscador y se cambia con onChange
    // Los resultados que se muestran según el archivo Buscador.jsx en el que vemos cartel, nombre y año de estreno
    // También tenemos acceso a los controles de añadir a una categoría u otra según Buscador.jsx
    return(
        <div className="pagina-buscador">
            <div className="contenedor">
                <div className="buscar-pelis">
                    <div className="buscador">
                        <input type="text"
                        placeholder="Busca una peli"
                        value={texto}
                        onChange={onChange}
                         />
                    </div>

                    {resultados.length > 0 && (
                        <ul className="resultados">
                            {resultados.map((peli) => (
                                <li key={peli.id}>
                                    <Buscador peli={peli}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nueva