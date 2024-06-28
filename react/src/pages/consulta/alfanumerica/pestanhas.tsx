// src/pages/pestanhas.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Pestanhas from 'components/consultaConAlfanumericos/Pestanhas';
import EstiloGlobal from 'estilos_paginas/global';

const PestanhasPage: React.FC = () => {
  const router = useRouter();
  const datosParaConsultar = router.query.datosParaConsultar;
  const modo = router.query.modo;

  let datosAnalizados;
  try {
    datosAnalizados = datosParaConsultar ? JSON.parse(datosParaConsultar as string) : {};
  } catch (e) {
    throw new Error(e ? `Datos no analizados, error: ${e}`: `Datos no analizados, error desconocido`);
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
      <Pestanhas datosParaConsultar={datosAnalizados} reiniciar={reiniciarEstado} modo={modo as 'online' | 'offline'} />
    </>
  );
};

export default PestanhasPage;
