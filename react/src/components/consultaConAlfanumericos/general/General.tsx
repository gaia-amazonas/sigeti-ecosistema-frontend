// components/graficos/general/General.tsx
import React from 'react';
import { FeatureCollection } from 'geojson';

import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapaComunidadesPorTerritorio from './MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface General {
  sexo: string;
  familias: string;
  sexo_edad: string;
  territorio: string;
  comunidades_en_territorio: string;
  territoriosGeoJson: FeatureCollection | null;
}

interface GeneralImp {
  datosGenerales: General[];
}

export const General: React.FC<GeneralImp> = ({ datosGenerales }) => {

  if (!datosGenerales || datosGenerales.length < 6 || !datosGenerales[0] || !datosGenerales[1] || !datosGenerales[2] || !datosGenerales[3] || !datosGenerales[4] || !datosGenerales[5] ) {
    return <div>Cargando...</div>;
  }

  const {
    sexoDatosEntrantes,
    familiasDatosEntrantes,
    sexoEdadDatosEntrantes,
    comunidadesGeometriesEntrantes,
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
        territoriosGeoJson={territoriosGeoJsonEntrantes}
        comunidadesGeometries={comunidadesGeometriesEntrantes}
      />
    </div>
  );
};

const extractorDeDatosEntrantes = (datos: any[]) => {

  return {
    sexoDatosEntrantes: datos[0].rows,
    familiasDatosEntrantes: datos[1].rows[0].familias,
    sexoEdadDatosEntrantes: datos[2].rows,
    territoriosGeometryEntrantes: datos[3].rows,
    comunidadesGeometriesEntrantes: datos[4].rows.map((row: any) => row.geometry),
    territoriosGeoJsonEntrantes: datos[5]
  }

}

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: any[]) => {
  return sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1),
  }));
}

const calculadorDeSexosPorEdades = (sexoDatos: any[]) => {
  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  return {
    mujerContador,
    hombreContador,
    totalContador: mujerContador + hombreContador,
  }
}

export default General;
