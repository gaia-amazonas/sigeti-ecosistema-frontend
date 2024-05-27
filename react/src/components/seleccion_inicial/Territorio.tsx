import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccion_inicial/estilos/Filtros';


interface Datos {
  territorio_id: string;
  comunidad_id: string;
}

interface Opcion {
  id_ti: string;
}

interface TerritorioImp {
  datos: Datos;
  establecerDatos: (datos: Datos) => void;
  siguientePaso: () => void;
}

const Territorio: React.FC<TerritorioImp> = ({ datos, establecerDatos, siguientePaso }) => {

  const [opciones, establecerOpciones] = useState<Opcion[]>([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState<Opcion[]>([]);
  const [filtro, establecerFiltro] = useState('');

  useEffect(() => {
    
    async function buscarDatos() {
      const consulta = `
        SELECT
          *
        FROM
          \`sigeti.censo_632.territorios\`
        ORDER BY
          id_ti;
      `;
      const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(consulta)}`);
      const resultado = await respuesta.json();
      const opcionesConTodos: Opcion[] = [{ id_ti: 'Todos' }, ...resultado.rows];
      establecerOpciones(opcionesConTodos);
      establecerOpcionesFiltradas(opcionesConTodos);
    }

    buscarDatos();

  }, []);

  useEffect(() => {
    establecerOpcionesFiltradas(
      opciones.filter((opcion) =>
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
      {opcionesFiltradas.map((opcion) => (
        <OpcionComoBoton key={opcion.id_ti} onClick={() => manejarSeleccion(opcion.id_ti)}>
          {opcion.id_ti}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default Territorio;
