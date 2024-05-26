import React, { useState, useEffect } from 'react';
import { Contenedor, FiltraEntrada, OpcionComoBoton } from 'components/seleccion_inicial/estilos/Filtros';

interface AATIImp {
  data: any;
  setData: (data: any) => void;
  nextStep: () => void;
}

const AATI: React.FC<AATIImp> = ({ data, setData, nextStep }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      const query = `
        SELECT
          ID_AATI, NOMBRE_AAT
        FROM
          \`sigeti-admin-364713.analysis_units.TE_AATI\``;
      const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
      const result = await response.json();
      setOptions(result.rows);
      setFilteredOptions(result.rows); // Initialize filtered options
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option: any) =>
        option.NOMBRE_AAT.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, options]);

  const handleSelect = (id_aati: string) => {
    setData({ ...data, aati_id: id_aati });
    nextStep();
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <Contenedor>
      <FiltraEntrada
        type="text"
        placeholder="Filtre escribiendo..."
        value={filter}
        onChange={handleFilterChange}
      />
      {filteredOptions.map((option: any) => (
        <OpcionComoBoton key={option.ID_AATI} onClick={() => handleSelect(option.ID_AATI)}>
          {option.NOMBRE_AAT}
        </OpcionComoBoton>
      ))}
    </Contenedor>
  );
};

export default AATI;
