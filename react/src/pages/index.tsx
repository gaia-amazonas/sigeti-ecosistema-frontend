import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EstiloGlobal from './estilos/global';
import Boton, { BotonesContenedor, Titulo } from './estilos/boton';

const Home: React.FC = () => {
  const [modo, establecerModo] = useState<'online' | 'offline'>('online');
  const [isOnline, setIsOnline] = useState<boolean>(true);

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
        <Titulo>Bienvenido a SIGETI</Titulo>
        {!isOnline ? (
          <p>Offline</p>
        ) : (
          <p></p>
        )}
        <BotonesContenedor>
          <Link href={{ pathname: '/consulta/alfanumerica/inicio', query: { modo } }} passHref>
            <Boton as="span">Seleccionar por Territorio y Comunidad</Boton>
          </Link>
          <Link href={{ pathname: '/consulta/espacial/inicio', query: { modo } }} passHref>
            <Boton as="span">Consultar con Mapa</Boton>
          </Link>
        </BotonesContenedor>
      </div>
    </>
  );
};

export default Home;
