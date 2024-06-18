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

  if (!datosGenerales || !datosGenerales.comunidadesGeoJson || !datosGenerales.familias || !datosGenerales.familiasPorComunidad || !datosGenerales.sexo || !datosGenerales.sexoEdad || !datosGenerales.sexoEdadPorComunidad || !datosGenerales.territorioGeoJson ) {
    return <div>Cargando...</div>;
  }

  const datosExtraidos = extractorDeDatosEntrantes(datosGenerales);

  console.log("DATOS EXTRAIDOS", datosExtraidos);

  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calculadorDeSexosPorEdades(datosExtraidos.sexo);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(datosExtraidos.sexoEdad);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={datosExtraidos.familias} />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <ComponenteSexoEdad
        datosPiramidalesSexoEdad={datosPiramidalesSexoEdad}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeoJson={datosExtraidos.territorioGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        comunidadesGeoJson={datosExtraidos.comunidadesGeoJson as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        modo={modo}
      />
    </div>
  );
};

export default ComponenteGeneralComponentesEnTerritorio;

const extractorDeDatosEntrantes = (datosGenerales: ComunidadesEnTerritorioDatosConsultados) => {

  const familias = datosGenerales.familias === null? null : datosGenerales.familias.rows.at(0)?.familias;
  return {
    sexo: datosGenerales.sexo,
    familias: familias === undefined? null : familias,
    sexoEdad: datosGenerales.sexoEdad,
    familiasPorComunidad: datosGenerales.familiasPorComunidad,
    sexoEdadPorComunidad: datosGenerales.sexoEdadPorComunidad,
    comunidadesGeoJson: datosGenerales.comunidadesGeoJson,
    territorioGeoJson: datosGenerales.territorioGeoJson
  }
}

const calculadorDeSexosPorEdades = (sexoDatos: Sexo | null) => {
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

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdad | null) => {
  if (!sexoEdadDatos) {
    return null;
  }
  return sexoEdadDatos.rows.map((item: SexoEdadFila) => ({
    grupoPorEdad: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1)
  }));
};