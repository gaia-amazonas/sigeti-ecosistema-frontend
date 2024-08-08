// src/components/BotonReiniciar.tsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Boton from './estilos/BotonReiniciar';

interface BotonReiniciarProps {
  onClick: () => void;
}

const BotonReiniciar: React.FC<BotonReiniciarProps> = ({ onClick }) => {
  return (
    <Boton onClick={onClick}>
        <FaArrowLeft
          style={{
            color: 'black',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))'
          }}
          size={24}
        />
    </Boton>
  );
};

export default BotonReiniciar;
