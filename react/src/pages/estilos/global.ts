import exp from 'constants';
import { createGlobalStyle } from 'styled-components';

const EstiloGlobal = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

export default EstiloGlobal;