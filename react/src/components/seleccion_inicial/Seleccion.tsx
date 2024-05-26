// src/components/seleccion_inicial/Seleccion.tsx
import React, { useEffect, useState } from 'react';

import Territorio from 'components/seleccion_inicial/Territorio';
import Comunidad from 'components/seleccion_inicial/Comunidad';

import { Contenedor, ContenedorPaso, Titulo } from 'components/seleccion_inicial/estilos/Seleccion';


interface Datos {
  territorio_id: string
  comunidad_id: string;
}

interface SeleccionImp {
  alFinalizar: (datos: Datos) => void;
}

const ProcesoSeleccion: React.FC<SeleccionImp> = ({ alFinalizar }) => {

  const siguientePaso = () => establecerPaso(paso + 1);
  const [paso, establecerPaso] = useState(1);
  const [datos, establecerDatos] = useState<Datos>({
    territorio_id: '',
    comunidad_id: '',
  });

  useEffect(() => {
    if (paso > 2) {
      alFinalizar(datos);
    }
  }, [paso, datos, alFinalizar]);

  return (
    <Contenedor>
      <ContenedorPaso>
        {paso === 1 && (
          <>
            <Titulo>Territorio</Titulo>
            <Territorio datos={datos} establecerDatos={establecerDatos} siguientePaso={siguientePaso} />
          </>
        )}
        {paso === 2 && (
          <>
            <Titulo>Comunidad Indígena</Titulo>
            <Comunidad datos={datos} establecerDatos={establecerDatos} siguientePaso={siguientePaso} />
          </>
        )}
      </ContenedorPaso>
    </Contenedor>
  );
};

export default ProcesoSeleccion;
