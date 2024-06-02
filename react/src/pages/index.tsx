import React, { useState } from 'react';
import Link from 'next/link';
import EstiloGlobal from './estilos/global';
import Boton, { BotonesContenedor, Titulo } from './estilos/boton';

const Home: React.FC = () => {
  const [modo, establecerModo] = useState<'online' | 'offline'>('online');

  const cambiarModo = () => {
    establecerModo(modoPrevio => (modoPrevio === 'online' ? 'offline' : 'online'));
    process.env.AMBIENTE = modo === 'online' ? 'offline' : 'online';
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
        <Titulo>Bienvenido a SIGETI</Titulo>
        <button onClick={cambiarModo}>
          {modo === 'online' ? 'Cambiar a modo Offline' : 'Cambiar a modo Online'}
        </button>
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
