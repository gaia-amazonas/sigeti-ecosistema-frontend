import React, { useState } from 'react';
import Link from 'next/link';
import EstiloGlobal from './estilos/global';
import Boton, { BotonesContenedor, Titulo } from './estilos/boton';

const Home: React.FC = () => {
  const [mode, setMode] = useState<'online' | 'offline'>('online');

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'online' ? 'offline' : 'online'));
    process.env.AMBIENTE = mode === 'online' ? 'offline' : 'online';
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
        <Titulo>Bienvenido a SIGETI</Titulo>
        <button onClick={toggleMode}>
          {mode === 'online' ? 'Switch to Offline Mode' : 'Switch to Online Mode'}
        </button>
        <BotonesContenedor>
          <Link href={{ pathname: '/consulta/alfanumerica/inicio', query: { mode } }} passHref>
            <Boton as="span">Seleccionar por Territorio y Comunidad</Boton>
          </Link>
          <Link href={{ pathname: '/consulta/espacial/inicio', query: { mode } }} passHref>
            <Boton as="span">Consultar con Mapa</Boton>
          </Link>
        </BotonesContenedor>
      </div>
    </>
  );
};

export default Home;
