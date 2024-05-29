// src/pages/index.tsx
import React, { useState } from 'react';

import BotonReiniciar from 'components/seleccion_inicial/BotonReiniciar';
import Pestanhas from 'components/Pestanhas';
import Seleccion from 'components/seleccion_inicial/Seleccion';

import EstiloGlobal, { Titulo } from './estilos/global';

const Home: React.FC = () => {
  const [mostrarPestanhas, setMostrarPestanhas] = useState(false);
  const [datos, setDatos] = useState({});

  const direccionaSeleccionFinalizadaAPestanhas = (seleccionaDatos: any) => {
    setDatos(seleccionaDatos);
    setMostrarPestanhas(true);
  };

  const reiniciarEstado = () => {
    setDatos({});
    setMostrarPestanhas(false);
  };

  return (
    <>
      <EstiloGlobal />
      <div style={{ position: 'relative' }}>
        <BotonReiniciar onClick={reiniciarEstado}/>
        {mostrarPestanhas ? (
          <Pestanhas datos={datos} />
        ) : (
          <>
            <Titulo>Seleccionando...</Titulo>
            <Seleccion alFinalizar={direccionaSeleccionFinalizadaAPestanhas} reiniciar={reiniciarEstado} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
