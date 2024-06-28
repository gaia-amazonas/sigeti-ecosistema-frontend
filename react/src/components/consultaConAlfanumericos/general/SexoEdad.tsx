// src/components/consultaConAlfanumericos/general/SexoEdad.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';

import { DatosPiramidalesItem } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';

interface SexoEdadImp {
  datosPiramidalesSexoEdad: DatosPiramidalesItem[] | null;
}

const SexoEdad: React.FC<SexoEdadImp> = ({ datosPiramidalesSexoEdad = null }) => {

  if (!datosPiramidalesSexoEdad) {
    return null;
  }

  const mujeresDatosPiramidales = datosPiramidalesSexoEdad
    .filter((item) => 'Mujer' in item)
    .map((item) => item.Mujer)
    .filter((value): value is number => value !== undefined);
  const hombresDatosPiramidales = datosPiramidalesSexoEdad
    .filter((item) => 'Hombre' in item)
    .map((item) => item.Hombre)
    .filter((value): value is number => value !== undefined);
  
  const mujeresEdadMaxima = Math.max(...mujeresDatosPiramidales);
  const hombresEdadMaxima = Math.abs(Math.min(...hombresDatosPiramidales));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={datosPiramidalesSexoEdad}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          allowDecimals={false} 
          domain={[-mujeresEdadMaxima * 1.5, hombresEdadMaxima * 1.5]}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis type="category" dataKey="grupoPorEdad" width={120} />
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
