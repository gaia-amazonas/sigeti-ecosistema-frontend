// src/components/seleccion_inicial/Territorio.tsx
import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccion_inicial/estilos/Filtros';


interface Datos {
  territorio_id: string
  comunidad_id: string;
}

interface TerritorioImp {
  datos: Datos;
  establecerDatos: (datos: Datos) => void;
  siguientePaso: () => void;
}

const Territorio: React.FC<TerritorioImp> = ({ datos, establecerDatos, siguientePaso }) => {

  const [opciones, establecerOpciones] = useState([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState([]);
  const [filtro, establecerFiltro] = useState('');

  useEffect(() => {

    async function buscarDatos() {
      const consulta = `
        SELECT
          id_ti, Nombre_territorio
        FROM
          \`sigeti-admin-364713.Gestion_Documental.Territorio\`;
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
      opciones.filter((opcion: any) =>
        opcion.id_ti.includes(filtro)
      )
    );
  }, [filtro, opciones]);

  const manejarSeleccion = (id_ti: string) => {
    establecerDatos({ ...datos, territorio_id: id_ti });
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
      {opcionesFiltradas.map((opcion: any) => (
        <OpcionComoBoton key={opcion.id_ti} onClick={() => manejarSeleccion(opcion.id_ti)}>
          {opcion.id_ti}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default Territorio;
