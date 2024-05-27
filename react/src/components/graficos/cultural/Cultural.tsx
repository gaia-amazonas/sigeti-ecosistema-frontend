// components/graficos/general/General.tsx
import React from 'react';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface GraphComponentProps {
  data: any[];
}

export const General: React.FC<GraphComponentProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
        <p>a</p>
    </div>
  );
};

export default General;
