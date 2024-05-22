//src/components/TerritorioIndigega.tsx

import { useState, useEffect } from 'react';
import { Container, OptionButton, Title, FilterInput } from 'src/components/seleccion_inicial/estilos/TerritorioIndigena.styles';

interface Props {
  data: any;
  setData: (data: any) => void;
  nextStep: () => void;
}

const TerritorioIndigena: React.FC<Props> = ({ data, setData, nextStep }) => {
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
      setFilteredOptions(result.rows); // Initialize filtered options
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
      <Title>Select Territorio Indigena</Title>
      <FilterInput
        type="text"
        placeholder="Filter options..."
        value={filter}
        onChange={handleFilterChange}
      />
      {filteredOptions.map((option: any) => (
        <OptionButton key={option.id_ti} onClick={() => handleSelect(option.id_ti)}>
          {option.Nombre_territorio}
        </OptionButton>
      ))}
    </Container>
  );
};

export default TerritorioIndigena;
