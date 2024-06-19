// components/graficos/general/General.tsx
import React from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapaComunidadesPorTerritorio from './MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface General {
  rows: any;
  sexo: string;
  familias: string;
  sexo_edad: string;
  territorio: string;
  comunidadesGeoJson: FeatureCollection | null;
  territoriosGeoJson: FeatureCollection | null;
  comunidades: string[];
  territorios: string[];
}

interface GeneralImp {
  datosGenerales: General[];
  modo: string | string[];
  tipoConsulta: string;
}

interface SexoEdadDatos {
  age_group: string;
  age_group_order: number;
  count: number;
  sexo: string;
}

interface SexoDatos {
  sexo: string;
  cantidad: number;
}

export const General: React.FC<GeneralImp> = ({ datosGenerales, modo, tipoConsulta }) => {

  if (!datosGenerales || datosGenerales.length < 5 || !datosGenerales[0] || !datosGenerales[1] || !datosGenerales[2] || !datosGenerales[3] || !datosGenerales[4] ) {
    return <div>Cargando...</div>;
  }

  const datosExtraidos = extractorDeDatosEntrantes(datosGenerales, tipoConsulta);

  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calculadorDeSexosPorEdades(datosExtraidos?.sexoDatosEntrantes);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(datosExtraidos?.sexoEdadDatosEntrantes);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={datosExtraidos?.familiasDatosEntrantes} />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
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

const extractorDeDatosEntrantes = (datos: General[], tipoConsulta: string) => {

  if (tipoConsulta === 'consultaComunidadesEnTerritorio') {
    return extractorComunidadesEnTerritorio(datos);
  }

}

const extractorComunidadesEnTerritorio = (datos: General[]) => {
  return {
    sexoDatosEntrantes: datos[0].rows,
    familiasDatosEntrantes: datos[1].rows[0].familias,
    sexoEdadDatosEntrantes: datos[2].rows,
    familiasPorComunidadDatosEntrantes: datos[3].rows,
    sexoEdadPorComunidadDatosEntrantes: datos[4].rows,
    comunidadesGeoJsonEntrantes: datos[5],
    territoriosGeoJsonEntrantes: datos[6]
  }
}

const calculadorDeSexosPorEdades = (sexoDatos: SexoDatos[]) => {
  const mujerContador = sexoDatos.find((row: any) => row.sexo === 'Mujer')?.cantidad || 0;
  const hombreContador = sexoDatos.find((row: any) => row.sexo === 'Hombre')?.cantidad || 0;
  return {
    mujerContador,
    hombreContador,
    totalContador: mujerContador + hombreContador,
  }
}

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdadDatos[]) => {
  return sexoEdadDatos.map((item: any) => ({
    grupoPorEdad: item.grupoPorEdad,
    [item.sexo]: item.contador * (item.sexo === 'Hombre' ? -1 : 1),
  }));
}

export default General;
