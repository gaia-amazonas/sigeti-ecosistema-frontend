// components/graficos/general/General.tsx
import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapaComunidadesPorTerritorio from './MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface GeneralImp {
  datos: any[];
}

export const General: React.FC<GeneralImp> = ({ datos }) => {

  // aseguraEntradaCompletadeDatosParaPestanha
  if (!datos || datos.length < 6 || !datos[0].rows || !datos[1].rows || !datos[2].rows || !datos[3].rows || !datos[4].rows || !datos[5].features) {
    return <div>Cargando...</div>;
  }

  const {
    sexoDatosEntrantes,
    familiasDatosEntrantes,
    sexoEdadDatosEntrantes,
    territoriosGeometryEntrantes,
    comunidadesGeometriesEntrantes,
    territoriosGeoJsonEntrantes
  } = extractorDeDatosEntrantes(datos);

  const {
    mujerContador,
    hombreContador,
    totalContador
  } = calculadorDeSexosPorEdades(sexoDatosEntrantes);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(sexoEdadDatosEntrantes);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Mujer contador={mujerContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={familiasDatosEntrantes} />
        <Hombre contador={hombreContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        datosPiramidalesSexoEdad={datosPiramidalesSexoEdad}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeometry={territoriosGeometryEntrantes}
        territoriosGeoJson={territoriosGeoJsonEntrantes}
        comunidadesGeometries={comunidadesGeometriesEntrantes}
      />
    </div>
  );
};

const aseguraEntradaCompletadeDatosParaPestanha = (datos: string | any[]) => {
  if (!datos || datos.length < 6 || !datos[0].rows || !datos[1].rows || !datos[2].rows || !datos[3].rows || !datos[4].rows || !datos[5].features) {
    return <div>Cargando...</div>;
  }
} 

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
