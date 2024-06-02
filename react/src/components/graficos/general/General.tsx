// components/graficos/general/General.tsx
import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapaComunidadesPorTerritorio from './MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface GeneralImp {
  data: any[];
}

export const General: React.FC<GeneralImp> = ({ data }) => {

  if (!data || data.length < 5 || !data[0].rows || !data[1].rows || !data[2].rows || !data[3].rows || !data[4].rows) {
    return <div>Cargando...</div>;
  }

  const {
    sexoDatos: sexoDatos,
    familiasDatos: familiasDatos,
    sexoEdadDatos: sexoEdadDatos,
    territoriosGeometry: territoriosGeometry,
    comunidadesGeometries: comunidadesGeometries
  } = extractorDeDatosEntrantes(data);

  const {
    mujerContador: mujerContador,
    hombreContador: hombreContador,
    totalContador: totalContador
  } = calculadorDeSexosPorEdades(sexoDatos);

  const datosPiramidalesSexoEdad = segmentaPorEdadYSexoParaGraficasPiramidales(sexoEdadDatos);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Mujer contador={mujerContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={familiasDatos} />
        <Hombre contador={hombreContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        datosPiramidalesSexoEdad={datosPiramidalesSexoEdad}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeometry={territoriosGeometry}
        comunidadesGeometries={comunidadesGeometries}
      />
    </div>
  );
};

const extractorDeDatosEntrantes = (datos: any[]) => {

  return {
    sexoDatos: datos[0].rows,
    familiasDatos: datos[1].rows[0].familias,
    sexoEdadDatos: datos[2].rows,
    territoriosGeometry: datos[3].rows,
    comunidadesGeometries: datos[4].rows.map((row: any) => row.geometry),
  }

}

const calculadorDeSexosPorEdades = (sexoDatos: any[]) {
  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0,
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0,
  return {
    mujerContador: mujerContador,
    hombreContador: hombreContador,
    totalContador: mujerContador + hombreContador,
  }
}

const segmentaPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: any[]) {
  return sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1),
  }));
}

export default General;
