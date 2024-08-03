// src/components/graficos/general/Mujer.tsx
import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from '../../estilos';

interface MujerComponentImp {
  contador: number | null;
}

const MujerComponent: React.FC<MujerComponentImp> = ({ contador }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Mujer_001.png" alt="Mujer" style={{height: '6rem', maxWidth: '6rem'}} />
      <CajaReductor>MUJERES<br />{contador === null? '-' : contador}</CajaReductor>
    </ContenedorImagen>
  );
};

export default MujerComponent;

