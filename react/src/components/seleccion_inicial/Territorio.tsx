// src/components/seleccion_inicial/Territorio.tsx
import React, { useState, useEffect } from 'react';
import { Container, OptionButton, Title, FilterInput } from 'components/seleccion_inicial/estilos/Filtros';

interface TerritorioImp {
  data: any;
  setData: (data: any) => void;
  nextStep: () => void;
}

const Territorio: React.FC<TerritorioImp> = ({ data, setData, nextStep }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      const query = `
        SELECT id_ti, Nombre_territorio
        FROM \`sigeti-admin-364713.Gestion_Documental.Territorio\`;`;
      const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
      const result = await response.json();
      setOptions(result.rows);
      setFilteredOptions(result.rows);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option: any) =>
        option.id_ti.includes(filter)
      )
    );
  }, [filter, options]);

  const handleSelect = (id_ti: string) => {
    setData({ ...data, territorio_id: id_ti });
    nextStep();
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <Container>
      <FilterInput
        type="text"
        placeholder="Filtre escribiendo..."
        value={filter}
        onChange={handleFilterChange}
      />
      {filteredOptions.map((option: any) => (
        <OptionButton key={option.id_ti} onClick={() => handleSelect(option.id_ti)}>
          {option.id_ti}
        </OptionButton>
      ))}
    </Container>
  );
};

export default Territorio;
