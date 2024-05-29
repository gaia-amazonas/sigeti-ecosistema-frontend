// src/components/seleccion_inicial/BotonReiniciar.tsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';

interface BotonReiniciarProps {
  onClick: () => void;
}

const Button = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
`;

const BotonReiniciar: React.FC<BotonReiniciarProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FaArrowLeft size={24} />
    </Button>
  );
};

export default BotonReiniciar;
