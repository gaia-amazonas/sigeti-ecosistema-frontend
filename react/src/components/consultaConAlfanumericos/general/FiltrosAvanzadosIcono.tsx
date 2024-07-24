// src/components/consultaConAlfanumericos/general/FiltrosAvanzados.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFilter } from 'react-icons/fa';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Circle = styled.div`
  position: fixed;
  top: 70%;
  left: 2rem;
  width: 4rem;
  height: 4rem;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s infinite;
  z-index: 1000;
`;

interface FiltrosAvanzadosIconoImp {
  onClick: () => void;
}

const FiltrosAvanzadosIcono: React.FC<FiltrosAvanzadosIconoImp> = ({ onClick }) => {
  return (
    <Circle onClick={onClick}>
      <FaFilter size={24} />
    </Circle>
  );
};

export default FiltrosAvanzadosIcono;
