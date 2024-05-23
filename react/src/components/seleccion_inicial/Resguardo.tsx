import React, { useState, useEffect } from 'react';
import { Container, OptionButton, Title, FilterInput } from 'src/components/seleccion_inicial/estilos/Filtros';

interface ResguardoIndigenaImp {
  data: any;
  setData: (data: any) => void;
  nextStep: () => void;
}

const ResguardoIndigena: React.FC<ResguardoIndigenaImp> = ({ data, setData, nextStep }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      const query = `
        SELECT ID_RI, NOMBRE_RI
        FROM (
            SELECT
                ID_RI,
                NOMBRE_RI,
                ROW_NUMBER() OVER (PARTITION BY ID_RI ORDER BY NOMBRE_RI) AS row_num
            FROM
                \`sigeti-admin-364713.analysis_units.TE_RI\`
        ) AS subquery
        WHERE
        row_num = 1;`;
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
        option.NOMBRE_RI.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, options]);

  const handleSelect = (id_ri: string) => {
    setData({ ...data, resguardo_id: id_ri });
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
        <OptionButton key={option.ID_RI} onClick={() => handleSelect(option.ID_RI)}>
          {option.NOMBRE_RI}
        </OptionButton>
      ))}
    </Container>
  );
};

export default ResguardoIndigena;
