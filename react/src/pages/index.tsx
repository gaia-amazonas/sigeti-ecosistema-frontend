// src/pages/index.tsx
import React, { useState } from 'react';

import Tabs from 'components/Tabs';
import Seleccion from 'components/seleccion_inicial/Seleccion';

import EstiloGlobal from './estilos/global';


const Home: React.FC = () => {

  const [mostrarTabs, setMostrarTabs] = useState(false);
  const [datos, setDatos] = useState({});

  const direccionaSeleccionFinalizadaATabs = (selectionData: any) => {
    setDatos(selectionData);
    setMostrarTabs(true);
  };

  return (
    <>
      <EstiloGlobal />
      <div>
        {mostrarTabs ? (
          <Tabs datos={datos} />
        ) : (
          <>
            <h1>Seleccionando...</h1>
            <Seleccion alFinalizar={direccionaSeleccionFinalizadaATabs} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;