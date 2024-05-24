// components/graficos/general/General.tsx
import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import { ContenedorGrafico, CajaTitulo } from '../estilos';
import MapComponent from './MapComponent';  // Ensure correct import path

interface GraphComponentProps {
  data: any[];
}

export const General: React.FC<GraphComponentProps> = ({ data }) => {
  if (!data || data.length < 5 || !data[0].rows || !data[1].rows || !data[2].rows || !data[3].rows || !data[4].rows) {
    return <div>Loading...</div>;
  }

  const sexoDatos = data[0].rows;
  const familiasDatos = data[1].rows[0].familias;
  const sexoEdadDatos = data[2].rows;
  const territorioGeometry = data[3].rows[0].geometry;
  const comunidadesGeometries = data[4].rows.map((row: any) => row.geometry);

  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  const totalContador = mujerContador + hombreContador;

  const pyramidData = sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1),
  }));

  const mujeresPorEdadMaximo = Math.max(...pyramidData.filter((item: { Mujer: any }) => item.Mujer).map((item: { Mujer: any }) => item.Mujer));
  const hombresPorEdadMaximo = Math.abs(Math.min(...pyramidData.filter((item: { Hombre: any }) => item.Hombre).map((item: { Hombre: any }) => item.Hombre)));

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Mujer count={mujerContador} />
        <TotalYFamilias totalCount={totalContador} familiasCount={familiasDatos} />
        <Hombre count={hombreContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        pyramidData={pyramidData}
        mujeresPorEdadMaximo={mujeresPorEdadMaximo}
        hombresPorEdadMaximo={hombresPorEdadMaximo}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapComponent
        territorioGeometry={territorioGeometry}
        comunidadesGeometries={comunidadesGeometries}
      />
    </div>
  );
};

export default General;
