// src/componente/seleccion_inicial/Seleccion.tsx
import React, { useEffect, useState } from 'react';

import Comunidad from './filtros/Comunidad';
import Territorio from './filtros/Territorio';
import { Contenedor, ContenedorPaso, Titulo } from './estilos/Seleccion';


interface DatosParaConsultar {
  territorios_id: string[];
  comunidades_id: string[];
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
    territorios_id: [],
    comunidades_id: [],
  });

  const siguientePaso = () => {
    establecerPaso(paso + 1);
    establecerPasoDinamico(paso + 1);
  };

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
        territorios_id: [],
        comunidades_id: [],
      });
    }
  }, [paso, reiniciar]);

  return (
    <Contenedor>
      <ContenedorPaso>
        {paso === 1 && (
          <>
            <Titulo>Territorio</Titulo>
            <Territorio datosParaConsultar={datosParaConsultar} establecerDatosParaConsultar={establecerDatosParaConsultar} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
        {paso === 2 && (
          <>
            <Titulo>Comunidad</Titulo>
            <Comunidad datosParaConsultar={datosParaConsultar} establecerDatosParaConsultar={establecerDatosParaConsultar} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
      </ContenedorPaso>
    </Contenedor>
  );
};

export default Seleccion;
