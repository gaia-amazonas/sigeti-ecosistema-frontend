import React, { useState, useEffect } from 'react';
import { Container, OptionButton, Title, FilterInput } from 'src/components/seleccion_inicial/estilos/Filtros';

interface ComunidadIndigenaImp {
    data: any;
    setData: (data: any) => void;
    nextStep: () => void;
}

const ComunidadIndigena: React.FC<ComunidadIndigenaImp> = ({ data, setData, nextStep }) => {
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        async function fetchData() {            
            const query = `
                SELECT id_cnida, loc_nmbespanol as comunidad
                FROM \`sigeti-admin-364713.censo_632.comunidad\``;
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
                option.id_cnida.includes(filter)
            )
        );
    }, [filter, options]);

    const handleSelect = (id_cnida: string) => {
        setData({ ...data, comunidad_id: id_cnida });
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
            {filteredOptions.map((option: any) =>(
                <OptionButton key={option.id_cnida} onClick={() => handleSelect(option.id_cnida)}>
                    {option.id_cnida}
                </OptionButton>
            ))}
        </Container>
    );
};

export default ComunidadIndigena;