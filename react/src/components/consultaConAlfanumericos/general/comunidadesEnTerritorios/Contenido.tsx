// src/components/consultaConAlfanumericos/general/comunindadesEnTerritorios/General.tsx
import React from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import ComunidadesEnTerritoriosDatosConsultados, { TerritoriosGeoJson } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';
import { Sexo, SexoEdad, SexoEdadFila, ComunidadesGeoJson } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';

import Mujer from '../sexo/Mujer';
import Hombre from '../sexo/Hombre';
import ComponenteSexoEdad from '../../SexoEdad';
import TotalYFamilias from '../TotalYFamilias';
import QueEstoyViendo from '../QueEstoyViendo';
import MapaComunidadesPorTerritorio from '../MapaComunidades';
import FamiliasYPoblacionYElectricidad from '../FamiliasYPoblacionYElectricidad';

import estilos from 'estilosParaMapas/ParaMapas.module.css';
import { ContenedorGrafico, CajaTitulo } from '../../estilos';

interface ComponenteGeneralComunidadesEnTerritorioImp {
  datosGenerales: ComunidadesEnTerritoriosDatosConsultados;
  modo: string | string[];
}

export const ComponenteGeneralComponentesEnTerritorios: React.FC<ComponenteGeneralComunidadesEnTerritorioImp> = ({ datosGenerales, modo }) => {

  if (datosGeneralesInvalidos(datosGenerales)) {
    return <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
            <div className={estilos.spinner}></div>
          </div>;
  }

  const datosExtraidos = extraerDatosEntrantes(datosGenerales);
  const comunidades = extraerComunidades(datosExtraidos.comunidadesGeoJson);
  const territorios = extraerTerritorio(datosExtraidos.territoriosGeoJson);
  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calcularSexosPorEdades(datosExtraidos.sexo);
  const datosPiramidalesSexoEdad = segmentarPorEdadYSexoParaGraficasPiramidales(datosExtraidos.sexoEdad);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <QueEstoyViendo
        comunidades={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        territorios={datosExtraidos.territoriosGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
      />
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias
          contadorTotal={totalContador}
          contadorFamilias={datosExtraidos.familias}
          comunidades={comunidades}
          territorios={territorios}
        />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>Sexo y Edad</CajaTitulo>
      <ComponenteSexoEdad datosPiramidalesSexoEdad={datosPiramidalesSexoEdad} labelIzquierdo='Hombre' labelDerecho='Mujer' />
      <CajaTitulo>Mapa</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeoJson={datosExtraidos.territoriosGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        comunidadesGeoJson={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        modo={modo}
      />
      <CajaTitulo>Familias y Población</CajaTitulo>
      <FamiliasYPoblacionYElectricidad
        familiasPorComunidad={datosExtraidos.familiasPorComunidad}
        poblacionPorComunidad={datosExtraidos.poblacionPorComunidad}
        familiasConElectricidadPorComunidad={datosExtraidos.familiasConElectricidadPorComunidad}
        comunidadesPorTerritorio={datosExtraidos.comunidadesEnTerritorios}
      />
    </div>
  );
};

export default ComponenteGeneralComponentesEnTerritorios;

const datosGeneralesInvalidos = (datosGenerales: ComunidadesEnTerritoriosDatosConsultados) => {
  return !datosGenerales.comunidadesGeoJson ||
  !datosGenerales.familias ||
  !datosGenerales.familiasPorComunidad ||
  !datosGenerales.sexo ||
  !datosGenerales.sexoEdad ||
  !datosGenerales.poblacionPorComunidad ||
  !datosGenerales.familiasConElectricidadPorComunidad ||
  !datosGenerales.territoriosGeoJson ||
  !datosGenerales.comunidadesEnTerritorios
}

const extraerDatosEntrantes = (datosGenerales: ComunidadesEnTerritoriosDatosConsultados) => {
  const familias = datosGenerales.familias === null? null : datosGenerales.familias.rows.at(0)?.familias;
  return {
    sexo: datosGenerales.sexo,
    familias: familias === undefined ? null : familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    poblacionPorComunidad: datosGenerales.poblacionPorComunidad,
    familiasConElectricidadPorComunidad: datosGenerales.familiasConElectricidadPorComunidad,
    comunidadesGeoJson: datosGenerales.comunidadesGeoJson,
    territoriosGeoJson: datosGenerales.territoriosGeoJson,
    comunidadesEnTerritorios: datosGenerales.comunidadesEnTerritorios
  }
}

const extraerComunidades = (comunidadesGeoJson: ComunidadesGeoJson | null): string[] | null => {
  if (comunidadesGeoJson) {
    return comunidadesGeoJson.features.map(feature => feature.properties ? feature.properties.nombre : null);
  }
  return null;
}

const extraerTerritorio = (territoriosGeoJson: TerritoriosGeoJson | null): string[] | null => {
  if (territoriosGeoJson) {
    return territoriosGeoJson.features.map(feature => feature.properties ? feature.properties.nombre : null)
  }
  return null;
}

const calcularSexosPorEdades = (sexoDatos: Sexo | null) => {
  const mujerContador = sexoDatos === null? null: sexoDatos.rows.filter(row => row.sexo === 'Mujer').map(row => row.cantidad)[0];
  const hombreContador = sexoDatos === null? null: sexoDatos.rows.filter(row => row.sexo === 'Hombre').map(row => row.cantidad)[0];
  let totalContador: number | null = null;
  if (mujerContador && hombreContador) {
    totalContador = hombreContador + mujerContador;
  }
  return {
    mujerContador,
    hombreContador,
    totalContador
  }
}

const segmentarPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdad | null) => {
  if (!sexoEdadDatos) {
    return null;
  }
  return sexoEdadDatos.rows.map((item: SexoEdadFila) => ({
    grupo: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1)
  }));
};
