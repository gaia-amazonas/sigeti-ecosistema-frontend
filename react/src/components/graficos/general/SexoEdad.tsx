import React from 'react';
import Mujer from './Mujer';
import Hombre from './Hombre';
import TotalYFamilias from './TotalYFamilias';
import { ContenedorGrafico } from '../estilos';
import { Title } from 'components/seleccion_inicial/estilos/Seleccion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';

interface GraphComponentProps {
  data: any[];
}

export const SexoEdad: React.FC<GraphComponentProps> = ({ data }) => {
  if (!data || data.length < 3 || !data[0].rows || !data[1].rows || !data[2].rows) {
    return <div>Loading...</div>;
  }

  const sexoDatos = data[0].rows;
  const familiasDatos = data[1].rows[0].familias;
  const sexoEdadDatos = data[2].rows;

  const mujerContador = sexoDatos.find((row: any) => row.SEXO === 'Mujer')?.f0_ || 0;
  const hombreContador = sexoDatos.find((row: any) => row.SEXO === 'Hombre')?.f0_ || 0;
  const totalContador = mujerContador + hombreContador;

  // Transform data for the population pyramid
  const pyramidData = sexoEdadDatos.map((item: any) => ({
    ageGroup: item.age_group,
    [item.sexo]: item.count * (item.sexo === 'Hombre' ? -1 : 1), // Invert count for 'Hombre' for the left side of the pyramid
  }));

  const mujeresPorEdadMaximo = Math.max(...pyramidData.filter((item: { Mujer: any; }) => item.Mujer).map((item: { Mujer: any; }) => item.Mujer));
  const hombresPorEdadMaximo = Math.abs(Math.min(...pyramidData.filter((item: { Hombre: any; }) => item.Hombre).map((item: { Hombre: any}) => item.Hombre)));

  return (
    <div> {/* Make this div scrollable */}
      <ContenedorGrafico>
        <Mujer count={mujerContador} />
        <TotalYFamilias totalCount={totalContador} familiasCount={familiasDatos} />
        <Hombre count={hombreContador} />
      </ContenedorGrafico>
      <div style={{ textAlign: 'center' }}> {/* This div wraps the title and centers it */}
        <Title>Población por Sexo y Edad</Title>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={pyramidData}
          layout="vertical"
          margin={{ top: 10, right: 70, left: 70, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            allowDecimals={false} 
            domain={[-mujeresPorEdadMaximo * 1.5, hombresPorEdadMaximo * 1.5]}
          />
          <YAxis type="category" dataKey="ageGroup" width={1} />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" height={36}/>
          <Bar dataKey="Hombre" fill="#5886A9" barSize={30}>
            <LabelList dataKey="Hombre" position="right" />
          </Bar>
          <Bar dataKey="Mujer" fill="#BE4D60" barSize={30}>
            <LabelList dataKey="Mujer" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};