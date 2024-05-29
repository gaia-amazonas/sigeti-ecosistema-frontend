// src/pages/index.tsx
import React from 'react';
import Link from 'next/link';
import EstiloGlobal, { Titulo } from './estilos/global';

const Home: React.FC = () => {
  return (
    <>
      <EstiloGlobal />
      <div style={{ position: 'relative' }}>
        <Titulo>Bienvenido</Titulo>
        <Link href="/alfanumerica" legacyBehavior>
          <a style={{ textDecoration: 'none', color: '#2F4F4F', fontSize: '20px', fontWeight: 'bold' }}>
            Ir a Selección
          </a>
        </Link>
      </div>
    </>
  );
};

export default Home;
