// src/pages/login.tsx

import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LoginForm from '../components/LoginForm';
import Head from 'next/head';

const LoginPage: React.FC = () => {
  return (
    <Container>
      <Head>
        <title>SIGETI - Iniciar sesión</title>
        <link rel="icon" type="image/x-icon" href="/iconos/favicon-sigeti.png" />
      </Head>
      <GlobalStyle />
      <ImageContainer>
        <img src="/img/fondo.jpg" alt="Background" />
      </ImageContainer>
      <LoginContainer>
        <img src="/logos/sigeti_logo_negro.png" alt="SIGETI Logo" />
        <Subtitle>Sistema de Información para la <br />Gestión Territorial Indígena</Subtitle>
        <h3>Ingrese con sus credenciales</h3>
        <LoginForm />
        <a href="#">¿Olvidé mi usuario y/o contraseña?</a>
        <p>
          Esta información se construyó con los pueblos indígenas del Macroterritorio Jaguares de Yuruparí 
          en el marco de la puesta en funcionamiento del decreto ley 632 de 2018. La Fundación Gaia Amazonas
          enfatiza en la importancia de su participación, contribución y generación de datos que benefician
          tanto a sus comunidades como a la sociedad en general.
        </p>
        <img src="/logos/logo_gaia.png" alt="Gaia Amazonas Logo" />
      </LoginContainer>
    </Container>
  );
};

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const ImageContainer = styled.div`
  flex: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LoginContainer = styled.div`
  background-color: #000000;
  padding: 20px;
  padding-top: 50px;
  width: 40%;
  text-align: center;
  height: auto;

  img {
    width: 40%;
    filter: invert(100%);
  }

  h3 {
    color: #ffffff;
  }

  a {
    font-size: 10px;
    color: #ffffff;
  }

  p {
    color: #ffffff;
    margin-top: 25px;
    border-left: 1px solid #ffffff;
    border-right: 1px solid #ffffff;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 10px;
  }
`;

const Subtitle = styled.div`
  color: #ffffff;
  font-family: sans-serif;
  margin-bottom: 50px;
`;

export default LoginPage;
