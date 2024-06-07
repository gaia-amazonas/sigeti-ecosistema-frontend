// src/componente/seleccion_inicial/Seleccion.tsx
import React, { useEffect, useState } from 'react';
import Territorio from './filtros/Territorio';
import Comunidad from './filtros/Comunidad';
import { Contenedor, ContenedorPaso, Titulo } from './estilos/Seleccion';

interface Datos {
  territorio_id: string;
  comunidad_id: string;
}

interface SeleccionImp {
  alFinalizar: (datos: Datos) => void;
  reiniciar: () => void;
  pasoDinamico: number;
  establecerPasoDinamico: (paso: number) => void;
  modo: 'online' | 'offline';
}

const Seleccion: React.FC<SeleccionImp> = ({ alFinalizar, reiniciar, pasoDinamico, establecerPasoDinamico, modo }) => {
  const [paso, establecerPaso] = useState<number>(1);
  const [datos, establecerDatos] = useState<Datos>({
    territorio_id: '',
    comunidad_id: '',
  });

  const siguientePaso = () => {
    establecerPaso(paso + 1);
    establecerPasoDinamico(paso + 1);
  };

  useEffect(() => {
    if (paso > 2) {
      alFinalizar(datos);
    }
  }, [paso, datos, alFinalizar]);

  useEffect(() => {
    establecerPaso(pasoDinamico);
  }, [pasoDinamico]);

  useEffect(() => {
    if (paso === 1) {
      establecerDatos({
        territorio_id: '',
        comunidad_id: '',
      });
    }
  }, [paso, reiniciar]);

  return (
    <Contenedor>
      <ContenedorPaso>
        {paso === 1 && (
          <>
            <Titulo>Territorio</Titulo>
            <Territorio datos={datos} establecerDatos={establecerDatos} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
        {paso === 2 && (
          <>
            <Titulo>Comunidad</Titulo>
            <Comunidad datos={datos} establecerDatos={establecerDatos} siguientePaso={siguientePaso} modo={modo} />
          </>
        )}
      </ContenedorPaso>
    </Contenedor>
  );
};

export default Seleccion;
