import React, { useState, useEffect } from 'react';
import { Contenedor, OpcionComoBoton, Titulo, FiltraEntrada } from 'components/seleccionAlfanumerica/estilos/Filtros';

interface ResguardoIndigenaImp {
  datos: any;
  establecerDatos: (datos: any) => void;
  siguientePaso: () => void;
}

const ResguardoIndigena: React.FC<ResguardoIndigenaImp> = ({ datos, establecerDatos, siguientePaso }) => {
  const [opciones, establecerOpciones] = useState([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function buscarResguardos() {
      const query = `
        SELECT ID_RI, NOMBRE_RI
          FROM (
            SELECT
              ID_RI,
              NOMBRE_RI,
              ROW_NUMBER() OVER (PARTITION BY ID_RI ORDER BY NOMBRE_RI) AS NUMERO_FILA
            FROM
              \`sigeti.ELT.TE_RI\`
          ) AS subquery
        WHERE
          NUMERO_FILA = 1;`;
      const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
      const resultado = await respuesta.json();
      establecerOpciones(resultado.rows);
      establecerOpcionesFiltradas(resultado.rows);
    }

    buscarResguardos();
  }, []);

  useEffect(() => {
    establecerOpcionesFiltradas(
      opciones.filter((opcion: any) =>
        opcion.NOMBRE_RI.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, opciones]);

  const controlarSeleccion = (id_ri: string) => {
    establecerDatos({ ...datos, resguardo_id: id_ri });
    siguientePaso();
  };

  const controlarCambioDeFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <Contenedor>
      <FiltraEntrada
        type="text"
        placeholder="Filtre escribiendo..."
        value={filter}
        onChange={controlarCambioDeFiltro}
      />
      {opcionesFiltradas.map((opcion: {ID_RI: string, NOMBRE_RI: string, NUMERO_FILA: number}) => (
        <OpcionComoBoton key={opcion.ID_RI} onClick={() => controlarSeleccion(opcion.ID_RI)}>
          {opcion.NOMBRE_RI}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default ResguardoIndigena;
