import React from 'react';
import { ContenedorTotal, CajaReductor, CajaTitulo, RectanguloAmarillo } from './StyledComponents';
import { color } from 'chart.js/helpers';

interface TotalComponentProps {
  totalCount: number;
  familiasCount: number;
}

const TotalComponent: React.FC<TotalComponentProps> = ({ totalCount, familiasCount }) => {
  return (
    <ContenedorTotal>
      <CajaTitulo>POBLACIÓN TOTAL</CajaTitulo>
      <CajaReductor style={{ background: 'transparent', color: 'black' }}>{totalCount}</CajaReductor>
      <RectanguloAmarillo>
        <div>FAMILIAS<br />{familiasCount}</div> 
      </RectanguloAmarillo>
    </ContenedorTotal>
  );
};

export default TotalComponent;
