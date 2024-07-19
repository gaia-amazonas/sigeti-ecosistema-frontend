import React from 'react';
import { useRouter } from 'next/router';
import IframeGEE from '../../../components/consultaMeteorologica/gee';
import EstiloGlobal, { Titulo } from 'estilos_paginas/global';
import BotonReiniciar from 'components/BotonReiniciar';

const Espacial: React.FC = () => {
  const router = useRouter();
  const { modo } = router.query;

  const reiniciarEstado = () => {
    router.push('/');
  };

  const modoString: string = Array.isArray(modo) ? modo[0] : modo || '';

  return (
    <>
      <EstiloGlobal />
      <BotonReiniciar onClick={reiniciarEstado} />
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <Titulo>El Amazonas <br></br> desde Satélites</Titulo>
        <IframeGEE />
      </div>
    </>
  );
};

export default Espacial;
