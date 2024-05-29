// src/components/graficos/general/SexoEdad.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';

interface SexoEdadImp {
  datosPiramidales: any[];
}

const SexoEdad: React.FC<SexoEdadImp> = ({ datosPiramidales }) => {

  const mujeresDatosPiramidales = datosPiramidales
    .filter((item: { Mujer: any }) => item.Mujer)
    .map((item: { Mujer: any }) => item.Mujer);

  const hombresDatosPiramidales = datosPiramidales
    .filter((item: {Hombre: any}) => item.Hombre)
    .map((item: {Hombre: any}) => item.Hombre);
  
  const mujeresEdadMaxima = Math.max(...mujeresDatosPiramidales);
  const hombresEdadMaxima = Math.abs(Math.min(...hombresDatosPiramidales));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={datosPiramidales}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 70, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          allowDecimals={false} 
          domain={[-mujeresEdadMaxima * 1.5, hombresEdadMaxima * 1.5]}
        />
        <YAxis type="category" dataKey="ageGroup" width={1} />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" height={36} />
        <Bar dataKey="Hombre" fill="#5886A9" barSize={30}>
          <LabelList dataKey="Hombre" position="right" />
        </Bar>
        <Bar dataKey="Mujer" fill="#BE4D60" barSize={30}>
          <LabelList dataKey="Mujer" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SexoEdad;
