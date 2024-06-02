// src/pages/alfanumerica/inicio.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BotonReiniciar from 'components/BotonReiniciar';
import Seleccion from 'components/seleccion_inicial/Seleccion';
import EstiloGlobal, { Titulo } from 'estilos_paginas/global';

const Alfanumerica: React.FC = () => {
  const [pasoDinamico, establecerPasoDinamico] = useState(1);
  const router = useRouter();
  const { mode } = router.query;

  const direccionaSeleccionFinalizadaAPestanhas = (seleccionaDatos: any) => {
    router.push({
      pathname: '/consulta/alfanumerica/pestanhas',
      query: { datos: JSON.stringify(seleccionaDatos) },
    });
  };

  const reiniciarEstado = () => {
    if (pasoDinamico === 1) {
      router.push('/');
    } else {
      router.push('/consulta/alfanumerica/inicio');
    }
    establecerPasoDinamico(1);
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ position: 'relative' }}>
        <BotonReiniciar onClick={reiniciarEstado} />
        <Titulo>Seleccionando...</Titulo>
        <Seleccion 
          alFinalizar={direccionaSeleccionFinalizadaAPestanhas} 
          reiniciar={reiniciarEstado} 
          pasoDinamico={pasoDinamico} 
          establecerPasoDinamico={establecerPasoDinamico} 
          mode={mode as 'online' | 'offline'}
        />
      </div>
    </>
  );
};

export default Alfanumerica;
