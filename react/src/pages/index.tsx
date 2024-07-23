// src/pages/index.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import EstiloGlobal from './estilos/global';
import Header from './estilos/header';
import Boton, { BotonesContenedor } from './estilos/boton';
import LogoutButton from '../components/LogoutButton';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const [modo, establecerModo] = useState<'online' | 'offline'>('online');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { user, setUser } = useUser();

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

  return (
    <>
      <EstiloGlobal />
      <Container>
        <Header>SIGETI</Header>
          {!isOnline ? <p>Offline</p> : <p></p>}
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
        {user ? (
          <>
            <p>Bienvenido, {user.username}!</p>
            <p>Su rol es: {user.role}</p>
            <LogoutButton />
          </>
        ) : (
          <nav>
            <Link href="/login">Login</Link>
          </nav>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: flex-start;
  padding-top: 10px;
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
  --translate-x: 0;
  --translate-y: 0;
  animation: ${radialAppear} 0.5s ease-out forwards;

  &:nth-child(1) {
    --translate-x: 7rem;
    --translate-y: -4rem;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    --translate-x: 7rem;
    --translate-y: -10rem;
    animation-delay: 0.1s;
  }
  
  &:nth-child(3) {
    --translate-x: 9.5rem;
    --translate-y: 0.5rem;
    animation-delay: 0.1s;
  }
`;

export default Home;
