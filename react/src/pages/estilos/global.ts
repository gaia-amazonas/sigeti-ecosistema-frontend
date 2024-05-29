// src/pages/estilos/global.ts
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

const EstiloGlobal = createGlobalStyle`
  body, html, #root {
    width: 100vw;
    margin: 0;
  }

  button.reset-button {
    position: absolute;
    top: 10px;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
`;

export const Titulo = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F;
  text-align: center;
`;

export default EstiloGlobal;
