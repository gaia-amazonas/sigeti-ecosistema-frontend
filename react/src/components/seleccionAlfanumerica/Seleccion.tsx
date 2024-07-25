// src/componente/seleccion_inicial/Seleccion.tsx
import React, { useEffect, useState } from 'react';

import Comunidad from './filtros/Comunidad';
import Territorio from './filtros/Territorio';
import { Contenedor, ContenedorPaso, Titulo } from './estilos/Seleccion';
import { BotonSiguiente } from './estilos/Filtros';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface SeleccionImp {
  alFinalizar: (datosParaConsultar: DatosParaConsultar) => void;
  reiniciar: () => void;
  pasoDinamico: number;
  establecerPasoDinamico: (paso: number) => void;
  modo: 'online' | 'offline';
}

const Seleccion: React.FC<SeleccionImp> = ({ alFinalizar, reiniciar, pasoDinamico, establecerPasoDinamico, modo }) => {
  const [paso, establecerPaso] = useState<number>(1);
  const [datosParaConsultar, establecerDatosParaConsultar] = useState<DatosParaConsultar>({
    territoriosId: [],
    comunidadesId: [],
  });

  const siguientePaso = () => {
    establecerPaso(paso + 1);
    establecerPasoDinamico(paso + 1);
  };

  const haySeleccionadosTerritorio = datosParaConsultar.territoriosId.length > 0 && datosParaConsultar.territoriosId[0] !== "Todos";
  const haySeleccionadosComunidad = datosParaConsultar.comunidadesId.length > 0 && datosParaConsultar.comunidadesId[0] !== "Todas";

  useEffect(() => {
    if (paso > 2) {
      alFinalizar(datosParaConsultar);
    }
  }, [paso, datosParaConsultar, alFinalizar]);

  useEffect(() => {
    establecerPaso(pasoDinamico);
  }, [pasoDinamico]);

  useEffect(() => {
    if (paso === 1) {
      establecerDatosParaConsultar({
        territoriosId: [],
        comunidadesId: [],
      });
    }
  }, [paso, reiniciar]);

  return (
    <Contenedor>
      <ContenedorPaso>
        {paso === 1 && (
          <>
            <Titulo>Territorio</Titulo>
            {haySeleccionadosTerritorio && <BotonSiguiente onClick={siguientePaso}>Siguiente</BotonSiguiente>}
            <Territorio datosParaConsultar={datosParaConsultar} establecerDatosParaConsultar={establecerDatosParaConsultar} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
        {paso === 2 && (
          <>
            <Titulo>Comunidad</Titulo>
            {haySeleccionadosComunidad && <BotonSiguiente onClick={siguientePaso}>Siguiente</BotonSiguiente>}
            <Comunidad datosParaConsultar={datosParaConsultar} establecerDatosParaConsultar={establecerDatosParaConsultar} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
      </ContenedorPaso>
    </Contenedor>
  );
};

export default Seleccion;
