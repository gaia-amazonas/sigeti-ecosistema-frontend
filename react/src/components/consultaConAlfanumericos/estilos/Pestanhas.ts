// src/components/estilos/Pestanhas.ts
import styled from 'styled-components';

export const Contenedor = styled.div`
  font-family: 'Roboto', sans-serif;
  display: grid;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
`;

export const Titulo = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F;
  text-align: center;
`;

export const ListaPestanhas = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const EstiloPestanha = styled.button<{ $activo: boolean }>`
  background-color: ${({ $activo }) => ($activo ? '#228B22' : '#8B4513')};
  font-size: 1rem;
  font-family: 'Lora', serif;
  color: white;
  padding: 1rem;
  border: none;
  cursor: pointer;
  flex: 1;
  text-align: center;
  &:hover {
    background-color: #4682B4;
  }
`;

export const PanelPestanhas = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  gap: 2rem;
`;