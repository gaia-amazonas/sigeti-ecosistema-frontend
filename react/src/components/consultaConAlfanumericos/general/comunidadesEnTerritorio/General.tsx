// General.tsx
import React from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import ComunidadesEnTerritorioDatosConsultados,
  { Sexo,
    SexoEdad,
    SexoEdadFila,
    ComunidadesGeoJson,
    TerritorioGeoJson,
    DatosPiramidalesItem } from 'tipos/datosConsultados/comunidadesEnTerritorio';

import Mujer from '../Mujer';
import Hombre from '../Hombre';
import ComponenteSexoEdad from '../SexoEdad';
import TotalYFamilias from '../TotalYFamilias';
import MapaComunidadesPorTerritorio from '../MapaComunidadesPorTerritorio';
import QueEstoyViendo from '../QueEstoyViendo';
import FamiliasYPoblacion from '../FamiliasYPoblacion';
import { ContenedorGrafico, CajaTitulo } from '../../estilos';

interface ComponenteGeneralComunidadesEnTerritorioImp {
  datosGenerales: ComunidadesEnTerritorioDatosConsultados;
  modo: string | string[];
}

export const ComponenteGeneralComponentesEnTerritorio: React.FC<ComponenteGeneralComunidadesEnTerritorioImp> = ({ datosGenerales, modo }) => {

  if (!datosGenerales || !datosGenerales.comunidadesGeoJson || !datosGenerales.familias || !datosGenerales.familiasPorComunidad || !datosGenerales.sexo || !datosGenerales.sexoEdad || !datosGenerales.poblacionPorComunidad || !datosGenerales.territorioGeoJson ) {
    return <div>Cargando...</div>;
  }

  const datosExtraidos = extraerDatosEntrantes(datosGenerales);
  const comunidades = extraerComunidades(datosExtraidos.comunidadesGeoJson);
  const territorio = extraerTerritorio(datosExtraidos.territorioGeoJson);
  
  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calcularSexosPorEdades(datosExtraidos.sexo);

  const datosPiramidalesSexoEdad: DatosPiramidalesItem[] | null = segmentarPorEdadYSexoParaGraficasPiramidales(datosExtraidos.sexoEdad);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias
          contadorTotal={totalContador}
          contadorFamilias={datosExtraidos.familias}
          comunidades={comunidades}
          territorios={territorio}
        />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <ComponenteSexoEdad datosPiramidalesSexoEdad={datosPiramidalesSexoEdad} />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeoJson={datosExtraidos.territorioGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        comunidadesGeoJson={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        modo={modo}
      />
      <QueEstoyViendo
        comunidades={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        territorios={datosExtraidos.territorioGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
      />
      <CajaTitulo>FAMILIAS Y POBLACIÓN</CajaTitulo>
      <FamiliasYPoblacion
        familiasPorComunidad={datosExtraidos.familiasPorComunidad}
        poblacionPorComunidad={datosExtraidos.poblacionPorComunidad}
      />
    </div>
  );
};

export default ComponenteGeneralComponentesEnTerritorio;

const extraerDatosEntrantes = (datosGenerales: ComunidadesEnTerritorioDatosConsultados) => {
  const familias = datosGenerales.familias === null? null : datosGenerales.familias.rows.at(0)?.familias;
  return {
    sexo: datosGenerales.sexo,
    familias: familias === undefined ? null : familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    poblacionPorComunidad: datosGenerales.poblacionPorComunidad,
    comunidadesGeoJson: datosGenerales.comunidadesGeoJson,
    territorioGeoJson: datosGenerales.territorioGeoJson
  }
}

const extraerComunidades = (comunidadesGeoJson: ComunidadesGeoJson | null): string[] | null => {
  if (comunidadesGeoJson) {
    return comunidadesGeoJson.features.map(feature => feature.properties ? feature.properties.nombre : null);
  }
  return null;
}

const extraerTerritorio = (territorioGeoJson: TerritorioGeoJson | null): string[] | null => {
  if (territorioGeoJson) {
    return territorioGeoJson.features.map(feature => feature.properties ? feature.properties.nombre : null)
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
    grupoPorEdad: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1)
  }));
};
