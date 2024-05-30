// src/pages/index.tsx
import React from 'react';
import Link from 'next/link';
import EstiloGlobal from './estilos/global';
import Boton, { BotonesContenedor, Titulo} from './estilos/boton';
 
const Home: React.FC = () => {
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
