// src/components/seleccion_inicial/Comunidad.tsx
import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccion_inicial/estilos/Filtros';


interface Datos {
  territorio_id: string
  comunidad_id: string;
}

interface Opcion {
  id_cnida: string;
}

interface ComunidadImp {
    datos: Datos;
    establecerDatos: (datos: Datos) => void;
    siguientePaso: () => void;
}


const consultas = {
    segregado: (territorio_id: string) => `
        SELECT
            id_cnida, comunidad
        FROM
            \`sigeti.censo_632.comunidades_por_territorio\`
        WHERE
            id_ti = '${territorio_id}'
        ORDER BY
            id_cnida;
        `,
    total: `
        SELECT
            id_cnida, comunidad
        FROM
            \`sigeti.censo_632.comunidades_por_territorio\`
        ORDER BY
            id_cnida;`
}

const Comunidad: React.FC<ComunidadImp> = ({ datos, establecerDatos, siguientePaso }) => {

    const [opciones, establecerOpciones] = useState([]);
    const [opcionesFiltradas, establecerOpcionesFiltradas] = useState([]);
    const [filtro, establecerFiltro] = useState('');

    useEffect(() => {

        async function buscarDatos(territorio_id: string) {
            let consulta: string;
            if (territorio_id === 'Todos') {
                consulta = consultas.total;
            } else {
                consulta = consultas.segregado(territorio_id)
            }
            const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
            const resultado = await respuesta.json();
            const opcionesConTodas: Opcion[] = [{ id_cnida: 'Todas' }, ...resultado.rows];
            establecerOpciones(opcionesConTodas);
            establecerOpcionesFiltradas(opcionesConTodas);
        }
        
        buscarDatos(datos.territorio_id);

    }, []);

    useEffect(() => {
        establecerOpcionesFiltradas(
            opciones.filter((opcion: any) =>
                opcion.id_cnida.includes(filtro)

            )
        );
    }, [filtro, opciones]);

    const manejarSeleccion = (id_cnida: string) => {
        establecerDatos({ ...datos, comunidad_id: id_cnida });
        siguientePaso();
    };

    const manejarCambioDeFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
        establecerFiltro(event.target.value);
    };

    return (
        <Contenedor>
            <FiltraEntrada
                type="text"
                placeholder="Filtre escribiendo..."
                value={filtro}
                onChange={manejarCambioDeFiltro}
            />
            {opcionesFiltradas.map((opcion: any) =>(
                <OpcionComoBoton key={opcion.id_cnida} onClick={() => manejarSeleccion(opcion.id_cnida)}>
                    {opcion.id_cnida}

                </OpcionComoBoton>
            ))}
        </Contenedor>
    );
};

export default Comunidad;