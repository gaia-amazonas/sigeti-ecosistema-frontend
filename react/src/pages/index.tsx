import React, { useState } from 'react';
import Seleccion from 'src/components/seleccion_inicial/Seleccion';
import Tabs from 'src/components/Tabs';
import { EstiloGlobal } from './estilos/global';

const Home: React.FC = () => {
  const [showTabs, setShowTabs] = useState(false);
  const [data, setData] = useState({});

  const direccionaSeleccionFinalizadaATabs = (selectionData: any) => {
    setData(selectionData);
    setShowTabs(true);
  };

  return (
    <>
      <EstiloGlobal />
      <div>
        {showTabs ? (
          <Tabs data={data} />
        ) : (
          <>
            <h1>Seleccionando...</h1>
            <Seleccion onFinish={direccionaSeleccionFinalizadaATabs} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;