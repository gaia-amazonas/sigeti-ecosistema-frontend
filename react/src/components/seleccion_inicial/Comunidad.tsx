// src/components/seleccion_inicial/Comunidad.tsx
import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccion_inicial/estilos/Filtros';


interface Datos {
  territorio_id: string
  comunidad_id: string;
}

interface ComunidadImp {
    datos: Datos;
    establecerDatos: (datos: Datos) => void;
    siguientePaso: () => void;
}

const ComunidadIndigena: React.FC<ComunidadImp> = ({ datos, establecerDatos, siguientePaso }) => {

    const [opciones, establecerOpciones] = useState([]);
    const [opcionesFiltradas, establecerOpcionesFiltradas] = useState([]);
    const [filtro, establecerFiltro] = useState('');

    useEffect(() => {

        async function buscarDatos() {            
            const consulta = `
                SELECT
                    id_cnida, loc_nmbespanol as comunidad
                FROM
                    \`sigeti-admin-364713.censo_632.comunidad\`
                `;
            const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
            const resultado = await respuesta.json();
            establecerOpciones(resultado.rows);
            establecerOpcionesFiltradas(resultado.rows);
        }
        
        buscarDatos();

    }, []);

    useEffect(() => {
        establecerOpcionesFiltradas(
            opciones.filter((option: any) =>
                option.id_cnida.includes(filtro)
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
            {opcionesFiltradas.map((option: any) =>(
                <OpcionComoBoton key={option.id_cnida} onClick={() => manejarSeleccion(option.id_cnida)}>
                    {option.id_cnida}
                </OpcionComoBoton>
            ))}
        </Contenedor>
    );
};

export default ComunidadIndigena;