// src/components/graficos/general/TotalYFamilias.tsx
import React from 'react';
import { ContenedorTotal, CajaReductor, CajaTitulo, RectanguloAmarillo } from '../estilos';

interface ComponenteTotalImp {
  contadorTotal: number | null;
  contadorFamilias: number | null;
}

const ComponenteTotal: React.FC<ComponenteTotalImp> = ({ contadorTotal, contadorFamilias }) => {
  return (
    <ContenedorTotal>
      <CajaTitulo>POBLACIÓN TOTAL</CajaTitulo>
      <CajaReductor style={{ background: 'transparent', color: 'black' }}>{contadorTotal === null? '-' : contadorTotal}</CajaReductor>
      <RectanguloAmarillo>
        <div>FAMILIAS<br />{contadorFamilias === null ? '-' : contadorFamilias}</div> 
      </RectanguloAmarillo>
    </ContenedorTotal>
  );
};

export default ComponenteTotal;
