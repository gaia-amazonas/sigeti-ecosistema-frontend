// src/pages/index.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import EstiloGlobal, { HeaderContainer, Spacer, UserSection, LoginContainer, StyledLink } from 'estilos_paginas/global';
import Boton, { BotonesContenedor } from './estilos/boton';
import LogoutButton from '../components/LogoutButton';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const [modo, establecerModo] = useState<'online' | 'offline'>('online');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const photos = [
    '/img/fotos_carrete/fc_1.jpg',
    '/img/fotos_carrete/fc_2.jpg',
    '/img/fotos_carrete/fc_3.jpg',
    '/img/fotos_carrete/fc_4.jpg',
    '/img/fotos_carrete/fc_5.jpg'
  ];

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

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const changePhoto = (direction: number) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
      newIndex = photos.length - 1;
    } else if (newIndex >= photos.length) {
      newIndex = 0;
    }
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <EstiloGlobal />
      <HeaderContainer>
        <Spacer />
        <Image
          style={{ marginRight: '3rem' }}
          className="sigeti_logo"
          src="/logos/sigeti_logo_negro.png"
          alt="Logotipo del sistema SIGETI"
          width={200}
          height={50}
        />
        <UserSection>
          {user ? (
            <>
              <p>Bienvenido, {user.username}!</p>
              <LogoutButton />
            </>
          ) : (
            <LoginContainer>
              <Image
                className="login_logo"
                src="/logos/login.png"
                alt="Login Logo"
                width={32}
                height={32}
              />
              <nav>
                <StyledLink href="/login">Entrar</StyledLink>
              </nav>
            </LoginContainer>
          )}
        </UserSection>
        <Spacer />
      </HeaderContainer>
      <ContainerSintesis>
        <h1>Por la gobernanza de los territorios indígenas</h1>
      </ContainerSintesis>
      <MainContainer>
        <Article>
          <h2>¿Cómo se originó este proceso?</h2>
          <p>
            En los departamentos de Amazonas, Guainía y Vaupés avanza un proceso histórico y fundamental para la construcción del Estado, la conservación de la Amazonía y la protección de la vida en el Planeta: se están formalizando en calidad de Entidades Territoriales los Territorios de más de 30 pueblos indígenas originarios. 
            Allí los pueblos indígenas han ejercido, desde sus sistemas de conocimiento, el gobierno en todas sus dimensiones: lo político, lo social, lo económico, lo normativo; sin embargo, la imposición de los estados nacionales construidos en la lógica colonial ha implicado fracturas en dichos sistemas de gobierno y territorialidad; 
            las cuales pueden ser superadas al cumplir el pacto constitucional de 1991, en el sentido de construir el Estado a partir de la realidad diversa y plural.
          </p>
          <p>
            El reconocimiento de la diversidad y la importancia de garantizar la vida llevó a que la Constitución Política de 1991 incluyera a los Territorios Indígenas como entidades territoriales del Estado colombiano. Sin embargo, en más de 30 años, el Estado no ha formalizado estas entidades, afectando los derechos de los pueblos indígenas. 
            La falta de acción del Congreso y de coordinación institucional ha resultado en una protección insuficiente para los pueblos indígenas amazónicos. En 2018, tras la presión indígena, se expidió el Decreto Ley 632 para formalizar estas entidades en los departamentos de Guainía, Vaupés y Amazonas, representando un avance en la lucha por sus derechos.
          </p>
        </Article>
        <Aside>
          <h2>Consejos indígenas</h2>
          <div>
            Selecciona el consejo de tu interés para iniciar la consulta:
          </div>
          <LogosTerritorios>
            <Link href="tiquie" passHref>
              <ContenedorLogo>
                <Image src="/logos/comunidadesIndigenas/AATIZOT.png" alt="Logotipo de Tiquie" width={48} height={48} />
                <p>Tiquie</p>
              </ContenedorLogo>
            </Link>
            <Link href="piraParana" passHref>
              <ContenedorLogo>
                <Image src="/logos/comunidadesIndigenas/ACAIPI.png" alt="Logotipo de Pirá Paraná" width={48} height={48} />
                <p>Pirá Paraná</p>
              </ContenedorLogo>
            </Link>
            <Link href="miritiParana" passHref>
              <ContenedorLogo>
                <Image src="/logos/comunidadesIndigenas/CITMA.png" alt="Logotipo de Mirití Paraná Amazonas" width={48} height={48} />
                <p>Mirití Paraná Amazonas</p>
              </ContenedorLogo>
            </Link>
            <Link href="yaigojeApaporis" passHref>
              <ContenedorLogo>
                <Image src="/logos/comunidadesIndigenas/CITYA.png" alt="Logotipo de Yaigojé Apaporis" width={48} height={48} />
                <p>Yaigojé Apaporis</p>
              </ContenedorLogo>
            </Link>
          </LogosTerritorios>
          <h2>Galería fotográfica</h2>
          <CarreteFotografias>
            <Carousel>
              <Image
                id="currentImage"
                src={photos[currentIndex]}
                alt={`Foto ${currentIndex + 1}`}
                width={600}
                height={400}
              />
              <button className="prev" onClick={() => changePhoto(-1)}>&#10094;</button>
              <button className="next" onClick={() => changePhoto(1)}>&#10095;</button>
            </Carousel>
          </CarreteFotografias>
        </Aside>
      </MainContainer>
      <TextoComplemento>
        <h2>Texto complementario del home</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero veritatis, impedit, 
          voluptatem expedita saepe omnis cupiditate recusandae quia unde tempora fugit facilis 
          totam laboriosam, dicta fugiat consequatur est eos ut.</p>
      </TextoComplemento>
      <MapaSitio>
        <h2>Índice del SIGETI</h2>
        
      </MapaSitio>
      <Footer>
        <div className="creditos">
        <p>Desarrollado por <a href='https://gaiaamazonas.org/'>Gaia Amazonas</a> con apoyo de las comunidades indígenas. 2024</p>
        </div>
      </Footer>
      <IconoHerramienta onClick={togglePopup}>
        <FaSearch size={50} />
      </IconoHerramienta>
      {showPopup && (
        <BotonesContenedor>
          <AnimatedLink href={{ pathname: '/consulta/alfanumerica/inicio', query: { modo } }}>
            <Boton as="span">Temáticas</Boton>
          </AnimatedLink>
          <AnimatedLink href={{ pathname: '/consulta/espacial/inicio', query: { modo } }}>
            <Boton as="span">Delimitación</Boton>
          </AnimatedLink>
          <AnimatedLink href={{ pathname: '/consulta/meteorologica/inicio', query: { modo } }}>
            <Boton as="span">Meteorología</Boton>
          </AnimatedLink>
        </BotonesContenedor>
      )}
    </>
  );
};

const ContainerSintesis = styled.div`
  background-image: url('/img/fondo_1.jpg');
  background-size: cover;
  color: #ffffff;
  text-align: center;
  padding: 5%;
`;

const MainContainer = styled.main`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const Article = styled.article`
  width: 40%;
  margin: 15px 0;
  background-color: #ffffff;
  text-align: left;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 5px 5px 9px #e5e1d8;

  h2 {
    text-align: center;
    color: #006a7c;
  }
`;

const Aside = styled.aside`
  width: 50%;
  height: 600px;
  margin: 15px 0;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 5px 5px 9px #e5e1d8;

  h2 {
    text-align: center;
    color: #006a7c;
  }
`;

const LogosTerritorios = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 8px;

  a, div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: #006a7c;
  }
`;

const ContenedorLogo = styled.div`
  background-color: #0293ac4a;
  height: 80px;
  width: 9rem;
  border: #006a7c 1px solid;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #006a7c;
    color: #ffffff;
    box-shadow: 10px 10px 15px #b5b2ad;
  }

  img {
    width: 3rem;
    margin-left: 1rem;
  }

  p {
    text-align: left;
    margin: 0;
    font-weight: 500;
  }
`;

const CarreteFotografias = styled.div`
  margin: 0 100px;
`;

const Carousel = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 18px;
    user-select: none;
  }

  .prev {
    left: 0;
  }

  .next {
    right: 0;
  }

  button:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #006a7c;
  box-shadow: 2px 2px 5px #000000;
  width: 100%;
  padding: 10px 0;

  .creditos {
    align-items: center;
    color: #ffffff;
  }
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
    right: 5rem;
    bottom: 9.5rem;
  }
  
  &:nth-child(3) {
    right: 1rem;
    bottom: 5rem;
  }
`;

const TextoComplemento = styled.div`
  background-color: #ffffff;
  margin: 1rem;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 5px 5px 9px #e5e1d8;
  
  h2 {
    text-align: center;
    color: #006a7c;
  }

  p {
    padding: 1rem;
  }
`;

const MapaSitio = styled.div`
  background-color: #ffffff;
  margin: 1rem;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 5px 5px 9px #e5e1d8;
  
  h2 {
    text-align: center;
    color: #006a7c;
  }

  p {
    padding: 1rem;
  }
`;

export default Home;
