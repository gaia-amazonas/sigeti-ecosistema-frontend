// src/components/graficos/general/Hombre.tsx
import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from '../../estilos';

interface HombreComponentImp {
  contador: number | null;
}

const HombreComponent: React.FC<HombreComponentImp> = ({ contador }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Hombre_002.png" alt="Hombre" style={{height: '6rem', maxWidth: '6rem'}} />
      <CajaReductor style={{ background: '#5886A9' }}>HOMBRES<br />{contador === null? '-' : contador}</CajaReductor>
    </ContenedorImagen>
  );
};

export default HombreComponent;
