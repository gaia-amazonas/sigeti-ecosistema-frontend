import { createGlobalStyle } from 'styled-components';

const EstiloGlobal = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100vw;
    overflow: hidden;
  }
`;

export default EstiloGlobal;