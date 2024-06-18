// components/graficos/general/General.tsx
import React from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import ComunidadesEnTerritorioDatosConsultados, { Sexo, SexoEdad, SexoEdadFila } from 'tipos/comunidadesEnTerritorioDatosConsultados';

import Mujer from '../Mujer';
import Hombre from '../Hombre';
import ComponenteSexoEdad from '../SexoEdad';
import TotalYFamilias from '../TotalYFamilias';
import MapaComunidadesPorTerritorio from '../MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../../estilos';


interface ComponenteGeneralComunidadesEnTerritorioImp {
  datosGenerales: ComunidadesEnTerritorioDatosConsultados;
  modo: string | string[];
}

export const ComponenteGeneralComponentesEnTerritorio: React.FC<ComponenteGeneralComunidadesEnTerritorioImp> = ({ datosGenerales, modo }) => {

  console.log("DATOS GENERALES: ", datosGenerales);

  if (!datosGenerales || !datosGenerales.comunidadesGeoJson ) {
    return <div>Cargando...</div>;
  }

  const datosExtraidos = extractorDeDatosEntrantes(datosGenerales);

  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calculadorDeSexosPorEdades(datosExtraidos.sexoDatosEntrantes);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(datosExtraidos.sexoEdadDatosEntrantes);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={datosExtraidos.familiasDatosEntrantes?.familias} />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <ComponenteSexoEdad
        datosPiramidalesSexoEdad={datosPiramidalesSexoEdad}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeoJson={datosExtraidos?.territoriosGeoJsonEntrantes as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        comunidadesGeoJson={datosExtraidos?.comunidadesGeoJsonEntrantes as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        modo={modo}
      />
    </div>
  );
};

export default ComponenteGeneralComponentesEnTerritorio;

const extractorDeDatosEntrantes = (datosGenerales: ComunidadesEnTerritorioDatosConsultados) => {
  return {
    sexoDatosEntrantes: datosGenerales.sexo,
    familiasDatosEntrantes: datosGenerales.familias?.rows,
    sexoEdadDatosEntrantes: datosGenerales.sexoEdad,
    familiasPorComunidadDatosEntrantes: datosGenerales.familiasPorComunidad,
    sexoEdadPorComunidadDatosEntrantes: datosGenerales.sexoEdadPorComunidad,
    comunidadesGeoJsonEntrantes: datosGenerales.comunidadesGeoJson,
    territoriosGeoJsonEntrantes: datosGenerales.comunidadesGeoJson
  }
}

const calculadorDeSexosPorEdades = (sexoDatos: Sexo | null) => {
  const mujerContador = sexoDatos?.rows.filter(row => row.sexo === 'Mujer').map(row => row.cantidad)[0] || 0;
  const hombreContador = sexoDatos?.rows.filter(row => row.sexo === 'Hombre').map(row => row.cantidad)[0] || 0;
  return {
    mujerContador,
    hombreContador,
    totalContador: mujerContador + hombreContador,
  }
}

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdad | null) => {
  return sexoEdadDatos?.rows.map((item: SexoEdadFila) => ({
    grupoPorEdad: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1)
  }));
}