import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccion_inicial/estilos/Filtros';

interface Datos {
  territorio_id: string;
  comunidad_id: string;
}

interface Opcion {
  id_ti: string;
  territorio: string;
}

interface TerritorioImp {
  datos: Datos;
  establecerDatos: (datos: Datos) => void;
  siguientePaso: () => void;
  modo: 'online' | 'offline';
}

const Territorio: React.FC<TerritorioImp> = ({ datos, establecerDatos, siguientePaso, modo }) => {
  const [opciones, establecerOpciones] = useState<Opcion[]>([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState<Opcion[]>([]);
  const [filtro, establecerFiltro] = useState('');

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
      const respuesta = await fetch(`${puntofinal}?query=${encodeURIComponent(consulta)}`);
      console.log("Respuesta API:", respuesta);
      const resultado = await respuesta.json();
      console.log("Resultado analizado:", resultado);

      if (resultado && resultado.rows) {
        const opcionesConTodos: Opcion[] = [{ id_ti: 'Todos', territorio: 'Todos' }, ...resultado.rows];
        establecerOpciones(opcionesConTodos);
        establecerOpcionesFiltradas(opcionesConTodos);
      } else {
        console.error("No rows found in response");
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
          {opcion.territorio}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default Territorio;
