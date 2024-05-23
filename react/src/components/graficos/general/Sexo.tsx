import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import TotalYFamilias from './TotalYFamilias';
import { ContenedorGrafico } from '../estilos';

interface GraphComponentProps {
  data: any[];
}

export const Sexo: React.FC<GraphComponentProps> = ({ data }) => {
  if (!data || data.length < 2 || !data[0].rows || !data[1].rows) {
    return <div>Loading...</div>;
  }

  const sexoData = data[0].rows;
  const familiasData = data[1].rows[0].familias;

  const mujerCount = sexoData.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreCount = sexoData.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  const totalCount = mujerCount + hombreCount;

  return (
    <ContenedorGrafico>
      <Mujer count={mujerCount} />
      <TotalYFamilias totalCount={totalCount} familiasCount={familiasData} />
      <Hombre count={hombreCount} />
    </ContenedorGrafico>
  );
};
