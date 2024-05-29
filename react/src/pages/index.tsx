// src/pages/index.tsx
import React, { useState } from 'react';

import Pestanhas from 'components/Pestanhas';
import Seleccion from 'components/seleccion_inicial/Seleccion';

import EstiloGlobal from './estilos/global';


const Home: React.FC = () => {

  const [mostrarPestanhas, setMostrarPestanhas] = useState(false);
  const [datos, setDatos] = useState({});

  const direccionaSeleccionFinalizadaAPestanhas = (seleccionaDatos: any) => {
    setDatos(seleccionaDatos);
    setMostrarPestanhas(true);
  };

  return (
    <>
      <EstiloGlobal />
      <div>
        {mostrarPestanhas ? (
          <Pestanhas datos={datos} />
        ) : (
          <>
            <h1>Seleccionando...</h1>
            <Seleccion alFinalizar={direccionaSeleccionFinalizadaAPestanhas} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;