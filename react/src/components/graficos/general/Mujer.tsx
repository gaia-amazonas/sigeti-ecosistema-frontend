// src/components/graficos/general/Mujer.tsx
import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from '../estilos';

interface MujerComponentImp {
  contador: number;
}

const MujerComponent: React.FC<MujerComponentImp> = ({ contador }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Mujer_001.png" alt="Mujer" />
      <CajaReductor>MUJERES<br />{contador}</CajaReductor>
    </ContenedorImagen>
  );
};

export default MujerComponent;
