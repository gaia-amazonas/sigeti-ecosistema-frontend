// src/components/consultaConAlfanumericos/cultural/BurbujaWrapper.tsx

import React, { useState } from 'react';
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
  const [mostrarMenosRepresentativoLenguas, setMostrarMenosRepresentativoLenguas] = useState(false);
  const [mostrarMenosRepresentativoEtnias, setMostrarMenosRepresentativoEtnias] = useState(false);
  const [mostrarMenosRepresentativoClanes, setMostrarMenosRepresentativoClanes] = useState(false);

  const toggleRepresentacionLenguas = () => {
    setMostrarMenosRepresentativoLenguas(!mostrarMenosRepresentativoLenguas);
  };

  const toggleRepresentacionEtnias = () => {
    setMostrarMenosRepresentativoEtnias(!mostrarMenosRepresentativoEtnias);
  };

  const toggleRepresentacionClanes = () => {
    setMostrarMenosRepresentativoClanes(!mostrarMenosRepresentativoClanes);
  };

  if (validaDatosCulturales(datos, queEstoyViendo)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }
  
  return (
    <>
      <CajaTitulo>Distribución de Lenguas</CajaTitulo>
      <button onClick={toggleRepresentacionLenguas}>
        {mostrarMenosRepresentativoLenguas ? 'Mostrar Más Representativo' : 'Mostrar Menos Representativo'}
      </button>
      <MapaCultural
        territoriosGeoJson={queEstoyViendo.territoriosGeoJson}
        comunidadesGeoJson={queEstoyViendo.comunidadesGeoJson}
        modo={modo}
        datos={datos.lenguas.rows}
        agregador='comunidadId'
        variable='lengua'
        mostrarMenosRepresentativo={mostrarMenosRepresentativoLenguas}
      />

      <CajaTitulo>Distribución de Etnias</CajaTitulo>
      <button onClick={toggleRepresentacionEtnias}>
        {mostrarMenosRepresentativoEtnias ? 'Mostrar Más Representativo' : 'Mostrar Menos Representativo'}
      </button>
      <MapaCultural
        territoriosGeoJson={queEstoyViendo.territoriosGeoJson}
        comunidadesGeoJson={queEstoyViendo.comunidadesGeoJson}
        modo={modo}
        datos={datos.etnias.rows}
        agregador='comunidadId'
        variable='etnia'
        mostrarMenosRepresentativo={mostrarMenosRepresentativoEtnias}
      />

      <CajaTitulo>Distribución de Clanes</CajaTitulo>
      <button onClick={toggleRepresentacionClanes}>
        {mostrarMenosRepresentativoClanes ? 'Mostrar Más Representativo' : 'Mostrar Menos Representativo'}
      </button>  
      <MapaCultural
        territoriosGeoJson={queEstoyViendo.territoriosGeoJson}
        comunidadesGeoJson={queEstoyViendo.comunidadesGeoJson}
        modo={modo}
        datos={datos.clanes.rows}
        agregador='comunidadId'
        variable='clan'
        mostrarMenosRepresentativo={mostrarMenosRepresentativoClanes}
      />

      <QueEstoyViendo
        comunidades={queEstoyViendo.comunidadesGeoJson}
        territorios={queEstoyViendo.territoriosGeoJson}
      />
    </>
  );
};

export default CulturalGraficoBurbujaWrapper;

const validaDatosCulturales = (datos: any, queEstoyViendo: { comunidadesGeoJson: any, territoriosGeoJson: any }) => {
  return !datos.lenguas ||
    !datos.etnias ||
    !datos.clanes ||
    !queEstoyViendo.comunidadesGeoJson ||
    !queEstoyViendo.territoriosGeoJson;
}
