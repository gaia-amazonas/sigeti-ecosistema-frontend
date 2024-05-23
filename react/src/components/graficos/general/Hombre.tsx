import React from 'react';
import { ContenedorImagen, Imagen, CajaReductor } from '../estilos';

interface HombreComponentProps {
  count: number;
}

const HombreComponent: React.FC<HombreComponentProps> = ({ count }) => {
  return (
    <ContenedorImagen>
      <Imagen src="/logos/Hombre_002.png" alt="Hombre" />
      <CajaReductor style={{ background: '#5886A9' }}>HOMBRES<br />{count}</CajaReductor>
    </ContenedorImagen>
  );
};

export default HombreComponent;
