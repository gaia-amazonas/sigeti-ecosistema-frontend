// src/pages/yaigojeApaporis.tsx

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import EstiloGlobal from './estilos/global';
import { FaHome, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Boton, { BotonesContenedor } from 'estilos_paginas/boton';

const YaigojeApaporis: React.FC = () => {
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
          <h1>Territorio Indígena Yaigojé Apaporis</h1>
          <p>
          Nuestro territorio indígena se encuentra ubicado al noreste del 
          departamento del Amazonas y al sureste del departamento del Vaupés; 
          incluye la totalidad del resguardo indígena Yaigojé Río Apaporis. 
          El proceso de configuración de la Entidad Territorial hace parte 
          de un proceso histórico, político y cultural, que busca garantizar 
          nuestros derechos fundamentales y colectivos a través del ejercicio 
          de la libre determinación en términos organizativos, administrativos, 
          de gobierno y gestión.
          </p>
        </Sintesis>
      </ContainerSintesis>
      <Instruccion>
        Para iniciar tu consulta haz click o toca sobre el icono de la lupa flotante 🔍 
        y elige la categoría que te interesa.&nbsp;<b>¡Bienvenido!</b>
      </Instruccion>
      <LogoTerritorio>
        <h1>Yaigojé Apaporis</h1>
        <Image
          src="/logos/comunidadesIndigenas/CITYA.png"
          alt="Logo Tiquie"
          width={200}
          height={305}
          style={{ width: 'auto' }}
        />
      </LogoTerritorio>
      <Indicadores>
        <h1>Indicadores</h1>
        <div>
          <Indicador>
            <span className="valor">22</span><span className="etiqueta-valor">comunidades en el territorio</span>
          </Indicador>
          <Indicador>
            <span className="valor"> 1.226.900 ha</span><span className="etiqueta-valor">Área total de las Entidades Territoriales</span>
          </Indicador>
          <Indicador>
            <span className="valor">1985</span><span className="etiqueta-valor">Habitantes</span>
          </Indicador>
        </div>
      </Indicadores>
      <Acerca_comunidad>
        <h2>Acerca de la Comunidad</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero veritatis, impedit, 
          voluptatem expedita saepe omnis cupiditate recusandae quia unde tempora fugit facilis 
          totam laboriosam, dicta fugiat consequatur est eos ut.</p>
      </Acerca_comunidad>
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
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #98c182; 
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
  background-image: url('img/f_apaporis.jpg');
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
  border: #98c182 solid 2px;
  padding: 5px;
  margin-top: 20px;
  margin-right: 30px;
  box-shadow: 5px 5px 9px #a7a5a0;
  border-radius: 15px;
  background-color: #ffffff;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content horizontally */

  h1 {
    color: #98c182;
    text-align: center;
  }

  div > img {
    width: 50%;
    margin-left: 120px;
  }
`;

const Indicadores = styled.div`
  border: #98c182 solid 2px;
  padding: 10px;
  margin: 50px;
  box-shadow: 5px 5px 9px #e5e1d8;
  border-radius: 15px;
  background-color: #ffffff;
  width: 40%;

  h1 {
    display: flex;
    justify-content: center;
    color: #98c182;
    text-align: center;
  }
`;

const Indicador = styled.div`
  border: #98c182 solid 2px;
  border-radius: 10px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 15px;
  margin-bottom: 15px;

  .valor {
    font-size: 50px;
    font-weight: bolder;
    color: #98c182;
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
  background-color: #98c182;
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

const Acerca_comunidad = styled.div`
  background-color: #ffffff;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 10px;
  border: #98c182 solid 2px;
  box-shadow: 5px 5px 9px #e5e1d8;
  
  h2 {
    text-align: center;
    color: #a5c992;
  }

  p {
    padding: 1rem;
  }
`
;

export default YaigojeApaporis;
