// src/pages/pestanhas.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Pestanhas from 'components/graficos/Pestanhas';
import EstiloGlobal from 'estilos_paginas/global';

const PestanhasPage: React.FC = () => {
  const router = useRouter();
  const datos = router.query.datos;
  const modo = router.query.modo;

  let parsedDatos;
  try {
    parsedDatos = datos ? JSON.parse(datos as string) : {};
  } catch (e) {
    parsedDatos = {};
  }

  const reiniciarEstado = () => {
    router.push({
      pathname: '/consulta/alfanumerica/inicio',
      query: { modo },
    });
  };

  return (
    <>
      <EstiloGlobal />
      <Pestanhas datos={parsedDatos} reiniciar={reiniciarEstado} modo={modo as 'online' | 'offline'} />
    </>
  );
};

export default PestanhasPage;
