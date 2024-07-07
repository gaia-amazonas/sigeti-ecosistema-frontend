import React, { useState, useEffect } from 'react';
import { Contenedor, FiltraEntrada, OpcionComoBoton } from 'components/seleccionAlfanumerica/estilos/Filtros';

interface AATIImp {
  datos: any;
  establecerDatos: (datos: any) => void;
  siguientePaso: () => void;
}

const AATI: React.FC<AATIImp> = ({ datos, establecerDatos, siguientePaso }) => {
  const [opciones, establecerOpciones] = useState([]);
  const [opcionesFiltradas, establecerOpcionesFiltradas] = useState([]);
  const [filtro, establecerFiltro] = useState('');

  useEffect(() => {
    async function buscarAATIs() {
      const query = `
        SELECT
          ID_AATI, NOMBRE_AAT
        FROM
          \`sigeti.ELT.TE_AATI\``;
      const respuesta = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
      const resultado = await respuesta.json();
      establecerOpciones(resultado.rows);
      establecerOpcionesFiltradas(resultado.rows);
    }
    buscarAATIs();
  }, []);

  useEffect(() => {
    establecerOpcionesFiltradas(
      opciones.filter((opcion: any) =>
        opcion.NOMBRE_AAT.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, opciones]);

  const controlarSeleccion = (id_aati: string) => {
    establecerDatos({ ...datos, aati_id: id_aati });
    siguientePaso();
  };

  const controlarCambioDeFiltro = (evento: React.ChangeEvent<HTMLInputElement>) => {
    establecerFiltro(evento.target.value);
  };

  return (
    <Contenedor>
      <FiltraEntrada
        type="text"
        placeholder="Filtre escribiendo..."
        value={filtro}
        onChange={controlarCambioDeFiltro}
      />
      {opcionesFiltradas.map((opcion: {ID_AATI: string, NOMBRE_AAT: string}) => (
        <OpcionComoBoton key={opcion.ID_AATI} onClick={() => controlarSeleccion(opcion.ID_AATI)}>
          {opcion.NOMBRE_AAT}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default AATI;
