// components/graficos/general/General.tsx
import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapaComunidadesPorTerritorio from './MapaComunidadesPorTerritorio';
import { ContenedorGrafico, CajaTitulo } from '../estilos';

interface GraphComponentProps {
  data: any[];
}

export const General: React.FC<GraphComponentProps> = ({ data }) => {
  if (!data || data.length < 5 || !data[0].rows || !data[1].rows || !data[2].rows || !data[3].rows || !data[4].rows) {
    return <div>Cargando...</div>;
  }

  const sexoDatos = data[0].rows;
  const familiasDatos = data[1].rows[0].familias;
  const sexoEdadDatos = data[2].rows;
  const territoriosGeometry = data[3].rows;
  const comunidadesGeometries = data[4].rows.map((row: any) => row.geometry);

  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  const totalContador = mujerContador + hombreContador;

  const datosPiramidales = sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1),
  }));

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Mujer contador={mujerContador} />
        <TotalYFamilias contadorTotal={totalContador} contadorFamilias={familiasDatos} />
        <Hombre contador={hombreContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        datosPiramidales={datosPiramidales}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapaComunidadesPorTerritorio
        territoriosGeometry={territoriosGeometry}
        comunidadesGeometries={comunidadesGeometries}
      />
    </div>
  );
};

export default General;
