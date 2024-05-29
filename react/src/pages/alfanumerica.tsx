// src/pages/alfanumerica.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BotonReiniciar from 'components/seleccion_inicial/BotonReiniciar';
import Seleccion from 'components/seleccion_inicial/Seleccion';
import EstiloGlobal, { Titulo } from './estilos/global';

const Alfanumerica: React.FC = () => {
  const [datos, setDatos] = useState({});
  const router = useRouter();

  const direccionaSeleccionFinalizadaAPestanhas = (seleccionaDatos: any) => {
    setDatos(seleccionaDatos);
    router.push({
      pathname: '/pestanhas',
      query: { datos: JSON.stringify(seleccionaDatos) },
    });
  };

  const reiniciarEstado = () => {
    setDatos({});
    router.push('/');
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ position: 'relative' }}>
        <BotonReiniciar onClick={reiniciarEstado} />
        <Titulo>Seleccionando...</Titulo>
        <Seleccion alFinalizar={direccionaSeleccionFinalizadaAPestanhas} reiniciar={reiniciarEstado} />
      </div>
    </>
  );
};

export default Alfanumerica;
