// src/components/seleccion_inicial/estilos/Seleccion.ts
import styled from 'styled-components';

export const Contenedor = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ContenedorPaso = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
`;

export const Titulo = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #2f4f4f; /* Forest Green */
  font-family: 'Lora', serif;
`;