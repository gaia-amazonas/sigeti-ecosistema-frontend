// src/pages/estilos/global.ts

import styled from 'styled-components';

import { createGlobalStyle } from 'styled-components';

const EstiloGlobal = createGlobalStyle`
  body, html, #__next {
    width: 100vw;
    height: 100vh;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-image: url('/texturas/textura.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
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
