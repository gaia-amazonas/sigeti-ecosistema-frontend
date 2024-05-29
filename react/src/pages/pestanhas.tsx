// src/pages/pestanhas.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Pestanhas from 'components/Pestanhas';
import EstiloGlobal from './estilos/global';

const PestanhasPage: React.FC = () => {
  const router = useRouter();
  const { datos } = router.query;

  let parsedDatos;
  try {
    parsedDatos = datos ? JSON.parse(datos as string) : {};
  } catch (e) {
    parsedDatos = {};
  }

  return (
    <>
      <EstiloGlobal />
      <Pestanhas datos={parsedDatos} />
    </>
  );
};

export default PestanhasPage;
