// src/components/graficos/general/Hombre.tsx
import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from '../estilos';

interface HombreComponentImp {
  contador: number;
}

const HombreComponent: React.FC<HombreComponentImp> = ({ contador }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Hombre_002.png" alt="Hombre" />
      <CajaReductor style={{ background: '#5886A9' }}>HOMBRES<br />{contador}</CajaReductor>
    </ContenedorImagen>
  );
};

export default HombreComponent;
