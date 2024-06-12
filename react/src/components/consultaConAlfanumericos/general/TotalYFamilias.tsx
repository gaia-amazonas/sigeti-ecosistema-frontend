// src/components/graficos/general/TotalYFamilias.tsx
import React from 'react';
import { ContenedorTotal, CajaReductor, CajaTitulo, RectanguloAmarillo } from '../estilos';

interface TotalComponentProps {
  contadorTotal: number;
  contadorFamilias: number;
}

const TotalComponent: React.FC<TotalComponentProps> = ({ contadorTotal, contadorFamilias }) => {
  return (
    <ContenedorTotal>
      <CajaTitulo>POBLACIÓN TOTAL</CajaTitulo>
      <CajaReductor style={{ background: 'transparent', color: 'black' }}>{contadorTotal}</CajaReductor>
      <RectanguloAmarillo>
        <div>FAMILIAS<br />{contadorFamilias}</div> 
      </RectanguloAmarillo>
    </ContenedorTotal>
  );
};

export default TotalComponent;
