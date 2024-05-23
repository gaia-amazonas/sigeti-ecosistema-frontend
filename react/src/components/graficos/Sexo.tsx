import React from 'react';
import MujerComponent from './MujerComponent';
import HombreComponent from './HombreComponent';
import TotalComponent from './TotalComponent';
import { ContenedorGrafico } from './StyledComponents';

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
      <MujerComponent count={mujerCount} />
      <TotalComponent totalCount={totalCount} familiasCount={familiasData} />
      <HombreComponent count={hombreCount} />
    </ContenedorGrafico>
  );
};
