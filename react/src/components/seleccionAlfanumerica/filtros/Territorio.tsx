import React, { useState, useEffect } from 'react';
import logger from 'utilidades/logger';
import { Contenedor, OpcionComoBoton, FiltraEntrada, BotonSiguiente } from 'components/seleccionAlfanumerica/estilos/Filtros';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface Opcion {
  id_ti: string;
  territorio: string;
}

interface TerritorioImp {
  datosParaConsultar: DatosParaConsultar;
  establecerDatosParaConsultar: (datosParaConsultar: DatosParaConsultar) => void;
  siguientePaso: () => void;
  modo: 'online' | 'offline';
}

const Territorio: React.FC<TerritorioImp> = ({ datosParaConsultar, establecerDatosParaConsultar, siguientePaso, modo }) => {
  const [opciones, establecerOpciones] = useState<Opcion[]>([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState<Opcion[]>([]);
  const [filtro, establecerFiltro] = useState<string>('');
  const [seleccionados, establecerSeleccionados] = useState<string[]>(datosParaConsultar.territoriosId);

  useEffect(() => {
    async function buscarDatos() {
      const consulta = `
        SELECT
          id_ti, territorio
        FROM
          ${modo === 'online' ? '`sigeti.censo_632.territorios`' : 'sigetiescritorio.territorios'}
        ORDER BY
          id_ti ASC;
      `;
      const puntofinal = modo === 'online' ? '/api/bigQuery' : '/api/postgreSQL';
      try {
        const respuesta = await fetch(`${puntofinal}?query=${encodeURIComponent(consulta)}`);
        const resultado = await respuesta.json();
        if (resultado.rows) {
          const opcionesConTodos: Opcion[] = [{ id_ti: 'Todos', territorio: 'Todos' }, ...resultado.rows];
          establecerOpciones(opcionesConTodos);
          establecerOpcionesFiltradas(opcionesConTodos);
        } else {
          logger.error("No fueron halladas filas en la consulta");
        }
      } catch (error) {
        logger.error("Error buscando datos", { error });
      }
    }
    buscarDatos();

  }, [modo]);

  useEffect(() => {
    establecerOpcionesFiltradas(
      opciones.filter((opcion) =>
        opcion.id_ti.includes(filtro)
      )
    );
  }, [filtro, opciones]);

  const manejarSeleccion = (id_ti: string) => {
    if (seleccionados.includes(id_ti)) {
      establecerSeleccionados(seleccionados.filter(id => id !== id_ti));
    } else {
      establecerSeleccionados([...seleccionados, id_ti]);
    }
  };

  const manejarCambioDeFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
    establecerFiltro(event.target.value);
  };

  useEffect(() => {
    establecerDatosParaConsultar({ ...datosParaConsultar, territoriosId: seleccionados });
    if (seleccionados[0] === "Todos") {
      siguientePaso();
    }
  }, [seleccionados]);

  return (
    <Contenedor>
      <FiltraEntrada
        type="text"
        placeholder="Filtre escribiendo..."
        value={filtro}
        onChange={manejarCambioDeFiltro}
      />
      {seleccionados.length > 0 && (
        <BotonSiguiente onClick={siguientePaso}>Siguiente</BotonSiguiente>
      )}
      {opcionesFiltradas.map((opcion) => (
        <OpcionComoBoton
          key={opcion.id_ti}
          onClick={() => manejarSeleccion(opcion.id_ti)}
          seleccionado={seleccionados.includes(opcion.id_ti)}
        >
          {opcion.territorio}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default Territorio;

