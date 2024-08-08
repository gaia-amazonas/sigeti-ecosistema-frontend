// src/components/seleccion_inicial/filtros/Comunidad.tsx
import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, FiltraEntrada } from 'components/seleccionAlfanumerica/estilos/Filtros';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface Opcion {
  id_cnida: string;
  comunidad: string;
}

interface ComunidadImp {
  datosParaConsultar: DatosParaConsultar;
  establecerDatosParaConsultar: (datosParaConsultar: DatosParaConsultar) => void;
  siguientePaso: () => void;
  modo: 'online' | 'offline';
}

const consultas = {
  segregado: (territoriosId: string[], modo: 'online' | 'offline') => {
    const whereClause = territoriosId.length > 0 ? territoriosId.map(id => `id_ti = '${id}'`).join(' OR '): `id_ti = '${territoriosId[0]}'`;
    return `
      SELECT id_cnida, comunidad
      FROM \`sigeti.censo_632.representacion_comunidades_por_territorio_2\`
      WHERE ${whereClause}
      ORDER BY id_cnida;
    `;
  },
  total: (modo: 'online' | 'offline') => `
    SELECT id_cnida, comunidad
    FROM \`sigeti.censo_632.representacion_comunidades_por_territorio_2\`
    ORDER BY id_cnida;
  `
};

const Comunidad: React.FC<ComunidadImp> = ({ datosParaConsultar, establecerDatosParaConsultar, siguientePaso, modo }) => {
  const [opciones, establecerOpciones] = useState<Opcion[]>([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState<Opcion[]>([]);
  const [filtro, establecerFiltro] = useState<string>('');
  const [seleccionados, establecerSeleccionados] = useState<string[]>(datosParaConsultar.comunidadesId);

  useEffect(() => {
    async function buscarDatos(territoriosId: string[]) {
      let consulta: string;
      if (territoriosId[0] === 'Todos') {
        consulta = consultas.total(modo);
      } else {
        consulta = consultas.segregado(territoriosId, modo);
      }
      const puntofinal = modo === 'online' ? '/api/bigQuery' : '/api/postgreSQL';
      const respuesta = await fetch(`${puntofinal}?query=${encodeURIComponent(consulta)}`);
      const resultado = await respuesta.json();
      const opcionesConTodas: Opcion[] = [{ id_cnida: 'Todas', comunidad: 'Todas' }, ...resultado.rows];
      establecerOpciones(opcionesConTodas);
      establecerOpcionesFiltradas(opcionesConTodas);
    }
    buscarDatos(datosParaConsultar.territoriosId);
  }, [datosParaConsultar.territoriosId, modo]);

  useEffect(() => {
    establecerOpcionesFiltradas(
      opciones.filter((opcion) =>
        opcion.id_cnida.includes(filtro)
      )
    );
  }, [filtro, opciones]);

  const manejarSeleccion = (id_cnida: string) => {
    if (seleccionados.includes(id_cnida)) {
      establecerSeleccionados(seleccionados.filter(id => id !== id_cnida));
    } else {
      establecerSeleccionados([...seleccionados, id_cnida]);
    }
  };

  const manejarCambioDeFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
    establecerFiltro(event.target.value);
  };

  useEffect(() => {
    establecerDatosParaConsultar({ ...datosParaConsultar, comunidadesId: seleccionados });
    if (seleccionados[0] === "Todas") {
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
      {opcionesFiltradas.map((opcion) => (
        <OpcionComoBoton
          key={opcion.id_cnida}
          onClick={() => manejarSeleccion(opcion.id_cnida)}
          $seleccionado={seleccionados.includes(opcion.id_cnida)}
        >
          {opcion.comunidad}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default Comunidad;
