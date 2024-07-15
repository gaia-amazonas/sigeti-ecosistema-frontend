// src/components/consultaConAlfanumericos/cultural/BurbujaWrapper.tsx

import React from 'react';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import MapaCultural from './MapaCultural';
import { CajaTitulo } from '../estilos';
import QueEstoyViendo from '../general/QueEstoyViendo';

interface CulturalGraficoBurbujaWrapperImp {
  datos: any;
  queEstoyViendo: { comunidadesGeoJson: any, territoriosGeoJson: any };
  modo: string | string[];
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperImp> = ({ datos, queEstoyViendo, modo }) => {
  if (!datos.sexosPorLengua || !queEstoyViendo.comunidadesGeoJson || !queEstoyViendo.territoriosGeoJson) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <CajaTitulo>Distribución de Lenguas</CajaTitulo>
      <MapaCultural
        territoriosGeoJson={queEstoyViendo.territoriosGeoJson}
        comunidadesGeoJson={queEstoyViendo.comunidadesGeoJson}
        modo={modo}
        datos={datos.sexosPorLengua.rows}
      />
      <QueEstoyViendo
        comunidades={queEstoyViendo.comunidadesGeoJson}
        territorios={queEstoyViendo.territoriosGeoJson}
      />
    </>
  );
};

export default CulturalGraficoBurbujaWrapper;
