// src/pages/piraParana.tsx

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import EstiloGlobal from './estilos/global';
import { FaHome, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Boton, { BotonesContenedor } from 'estilos_paginas/boton';

const PiraParana: React.FC = () => {
  const [modo, establecerModo] = useState<'online' | 'offline'>('online');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const updateOnlineStatus = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);
      establecerModo(onlineStatus ? 'online' : 'offline');
    };

    if (typeof window !== 'undefined') {
      updateOnlineStatus();
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, []);

  return (
    <>
      <EstiloGlobal />
      <Header>
        <Image
          className="sigeti_logo"
          src="/logos/sigeti_logo_negro.png"
          alt="Logotipo del sistema SIGETI"
          width={200}
          height={50}
        />
        <Link href="/" passHref>
          <HomeButton>
            <FaHome size={30} />
          </HomeButton>
        </Link>
      </Header>
      <IconoHerramienta onClick={togglePopup}>
        <FaSearch size={50} />
      </IconoHerramienta>
      {showPopup && (
        <BotonesContenedor>
          <AnimatedLink href={{ pathname: '/consulta/alfanumerica/inicio', query: { modo } }}>
            <Boton as="span">Temáticas</Boton>
          </AnimatedLink>
          <AnimatedLink href={{ pathname: '/consulta/espacial/inicio', query: { modo } }}>
            <Boton as="span">Gestión Documental Territorial</Boton>
          </AnimatedLink>
          <AnimatedLink href={{ pathname: '/consulta/meteorologica/inicio', query: { modo } }}>
            <Boton as="span">Meteorología</Boton>
          </AnimatedLink>
        </BotonesContenedor>
      )}
      <ContainerSintesis>
        <Sintesis>
          <h1>Territorio Indígena del Río Pirá Paraná</h1>
          <p>
          Con base en los fundamentos y principio que sustentan nuestra existencia como Pueblos Indígenas 
          y en ejercicio de los derechos reconocidos en la Constitución Política a la autodeterminación, 
          la autonomía y a conformar nuestro gobierno de acuerdo con nuestros sistemas de conocimiento 
          entregados por los Ancestros Primordiales – Ayawa – constituimos el Consejo Indígena del Pirá Paraná, 
          como expresión representativa de nuestro Sistema de Gobierno.
          </p>
        </Sintesis>
      </ContainerSintesis>
      <Instruccion>
        Para iniciar tu consulta haz click o toca sobre el icono de la lupa flotante 🔍 
        y elige la categoría que te interesa.&nbsp;<b>¡Bienvenido!</b>
      </Instruccion>
      <LogoTerritorio>
        <h1>Pirá Paraná</h1>
        <Image
          src="/logos/comunidadesIndigenas/ACAIPI.png"
          alt="Logo Pirá Paraná"
          width={200}
          height={305}
          style={{ width: 'auto' }}
        />
      </LogoTerritorio>
      <Indicadores>
        <h1>Indicadores</h1>
        <div>
          <Indicador>
            <span className="valor">17</span><span className="etiqueta-valor">comunidades en el territorio</span>
          </Indicador>
          <Indicador>
            <span className="valor">5.302,01 km<sup>2</sup></span><span className="etiqueta-valor">Área total de las Entidades Territoriales</span>
          </Indicador>
          <Indicador>
            <span className="valor">2270</span><span className="etiqueta-valor">Habitantes</span>
          </Indicador>
        </div>
      </Indicadores>
      <Footer>
        <div className="creditos" style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          <p>Desarrollado por <a href='https://gaiaamazonas.org/'>Gaia Amazonas</a> con apoyo de las comunidades indígenas. 2024</p>
          </p>
        </div>
      </Footer>
    </>
  );
};

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #d59196; 
  place-items: center;
  box-shadow: 2px 2px 5px #000000;
  border: 1px solid #ccc;
  padding-top: 10px;
  padding-bottom: 10px; 

  .sigeti_logo {
    width: 200px;
    filter: invert(100%);
  }
`;

const HomeButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;

  a {
    color: #ffffff;
    text-decoration: none;

    &:hover {
      color: #cccccc;
    }
  }
`;

const ContainerSintesis = styled.div`
  background-image: url('img/f_pira.JPG');
  background-size: cover;
  color: #ffffff;
  text-align: center;
  padding: 5%;
`;

const Sintesis = styled.div`
  font-size: medium;
`;

const Instruccion = styled.p`
  margin: 30px;
  text-align: center;
  background-color: #ffffff;
  padding: 10px;
`;

const pulsate = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const IconoHerramienta = styled.div`
  position: fixed;
  bottom: 10rem;
  right: 1rem;
  cursor: pointer;
  animation: ${pulsate} 1.5s infinite;

  svg {
    color: #4682b4;
    transition: color 0.3s;
  }

  &:hover svg {
    color: #0056b3;
  }
`;

const LogoTerritorio = styled.div`
  float: right;
  vertical-align: top;
  border: #d59196 solid 2px;
  padding: 5px;
  margin-top: 20px;
  margin-right: 30px;
  box-shadow: 5px 5px 9px #a7a5a0;
  border-radius: 15px;
  background-color: #ffffff;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    color: #d59196;
    text-align: center;
  }

  div > img {
    width: 50%;
    margin-left: 120px;
  }
`;

const Indicadores = styled.div`
  border: #d59196 solid 2px;
  padding: 10px;
  margin: 50px;
  box-shadow: 5px 5px 9px #e5e1d8;
  border-radius: 15px;
  background-color: #ffffff;
  width: 40%;

  h1 {
    display: flex;
    justify-content: center;
    color: #d59196;
    text-align: center;
  }
`;

const Indicador = styled.div`
  border: #d59196 solid 2px;
  border-radius: 10px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 15px;
  margin-bottom: 15px;

  .valor {
    font-size: 50px;
    font-weight: bolder;
    color: #d59196;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .etiqueta-valor {
    font-size: 60px;
    display: flex;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    font-size: medium;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d59196;
  box-shadow: 2px 2px 5px #000000;
  width: 100%;
  padding: 10px 0;

  .creditos {
    position: relative;
    align-items: center;
    color: #ffffff;
  }
`;

const radialAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5) translate(0, 0);
  }
  to {
    opacity: 1;
    transform: scale(1) translate(var(--translate-x), var(--translate-y));
  }
`;

const AnimatedLink = styled(Link)`
  position: fixed;
  right: 1rem;
  bottom: 10rem;
  --translate-x: 0;
  --translate-y: 0;
  animation: ${radialAppear} 0.5s ease-out forwards;

  &:nth-child(1) {
    right: 1rem;
    bottom: 14rem;
  }

  &:nth-child(2) {
    right: 3rem;
    bottom: 9rem;
  }
  
  &:nth-child(3) {
    right: 1rem;
    bottom: 5rem;
  }
`;

export default PiraParana;
