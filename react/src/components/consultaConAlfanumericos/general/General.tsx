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
}

interface GeneralImp {
  datosGenerales: General[];
  modo: string | string[];
}

interface SexoEdadDatos {
  age_group: string;
  age_group_order: number;
  count: number;
  sexo: string;
}

interface SexoDatos {
  SEXO: string;
  f0_: number;
}

export const General: React.FC<GeneralImp> = ({ datosGenerales, modo }) => {

  if (!datosGenerales || datosGenerales.length < 5 || !datosGenerales[0] || !datosGenerales[1] || !datosGenerales[2] || !datosGenerales[3] || !datosGenerales[4] ) {
    return <div>Cargando...</div>;
  }

  const {
    sexoDatosEntrantes,
    familiasDatosEntrantes,
    sexoEdadDatosEntrantes,
    comunidadesGeoJsonEntrantes,
    territoriosGeoJsonEntrantes
  } = extractorDeDatosEntrantes(datosGenerales);

  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calculadorDeSexosPorEdades(sexoDatosEntrantes);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(sexoEdadDatosEntrantes);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Hombre contador={hombreContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={familiasDatosEntrantes} />
        <Mujer contador={mujerContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        datosPiramidalesSexoEdad={datosPiramidalesSexoEdad}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeoJson={territoriosGeoJsonEntrantes as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        comunidadesGeoJson={comunidadesGeoJsonEntrantes as unknown as FeatureCollection<Geometry, GeoJsonProperties>}
        modo={modo}
      />
    </div>
  );
};

const extractorDeDatosEntrantes = (datos: General[]) => {

  return {
    sexoDatosEntrantes: datos[0].rows,
    familiasDatosEntrantes: datos[1].rows[0].familias,
    sexoEdadDatosEntrantes: datos[2].rows,
    comunidadesGeoJsonEntrantes: datos[3],
    territoriosGeoJsonEntrantes: datos[4]
  }

}

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: SexoEdadDatos[]) => {
  return sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1),
  }));
}

const calculadorDeSexosPorEdades = (sexoDatos: SexoDatos[]) => {
  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  return {
    mujerContador,
    hombreContador,
    totalContador: mujerContador + hombreContador,
  }
}

export default General;
