import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from './StyledComponents';

interface MujerComponentProps {
  count: number;
}

const MujerComponent: React.FC<MujerComponentProps> = ({ count }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Mujer_001.png" alt="Mujer" />
      <CajaReductor>MUJERES<br />{count}</CajaReductor>
    </ContenedorImagen>
  );
};

export default MujerComponent;
