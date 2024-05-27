// components/graficos/general/General.tsx
import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import SexoEdad from './SexoEdad';
import TotalYFamilias from './TotalYFamilias';
import MapComponent from './MapaComunidadesPorTerritorio';
>>>>>>>>> Temporary merge branch 2
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

  const mujeresPorEdadMaximo = Math.max(...datosPiramidales.filter((item: { Mujer: any }) => item.Mujer).map((item: { Mujer: any }) => item.Mujer));
  const hombresPorEdadMaximo = Math.abs(Math.min(...datosPiramidales.filter((item: { Hombre: any }) => item.Hombre).map((item: { Hombre: any }) => item.Hombre)));

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ContenedorGrafico>
        <Mujer count={mujerContador} />
        <TotalYFamilias totalCount={totalContador} familiasCount={familiasDatos} />
        <Hombre count={hombreContador} />
      </ContenedorGrafico>
      <CajaTitulo>SEXO Y EDAD</CajaTitulo>
      <SexoEdad
        datosPiramidales={datosPiramidales}
        mujeresPorEdadMaximo={mujeresPorEdadMaximo}
        hombresPorEdadMaximo={hombresPorEdadMaximo}
      />
      <CajaTitulo>MAPA</CajaTitulo>
      <MapComponent
        territoriosGeometry={territoriosGeometry}
        comunidadesGeometries={comunidadesGeometries}
      />
    </div>
  );
};

export default General;
