// src/pages/estilos/global.ts

import styled from 'styled-components';
import Link from 'next/link';

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
    top: 10rem;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
`;

export const Titulo = styled.h1`
  padding-top: 5rem;
  font-family: 'Lora', serif;
  color: #2F4F4F;
  text-align: center;
`;

export const HeaderContainer = styled.header`
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #006a7c;
  box-shadow: 2px 2px 5px #000000;
  border: 0px solid #ccc;
  padding: 10px 20px;
  z-index: 10;

  .sigeti_logo {
    width: 200px;
    filter: invert(100%);
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

export const LoginContainer = styled.div`
  display: flex;
  align-items: center;

  .login_logo {
    width: 2rem;
    margin-right: 10px;
  }
`;

export const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Spacer = styled.div`
  flex: 1;
`;

export default EstiloGlobal;
