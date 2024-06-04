import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EstiloGlobal from './estilos/global';
import Boton, { BotonesContenedor, Titulo } from './estilos/boton';

const Home: React.FC = () => {
  const [mode, setMode] = useState('online');

  useEffect(() => {
    const storedMode = localStorage.getItem('mode');
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
    document.cookie = `mode=${newMode}; path=/`; // Set mode in cookies
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
        <Titulo>Bienvenido a SIGETI</Titulo>
        <BotonesContenedor>
          <Link href="/consulta/alfanumerica/inicio" passHref>
            <Boton as="span">Seleccionar por Territorio y Comunidad</Boton>
          </Link>
          <Link href="/consulta/espacial/inicio" passHref>
            <Boton as="span">Consultar con Mapa</Boton>
          </Link>
        </BotonesContenedor>
      </div>
    </>
  );
};

export default Home;
