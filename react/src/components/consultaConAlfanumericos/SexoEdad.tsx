// src/components/consultaConAlfanumericos/SexoEdad.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';

import { DatosPiramidalesItem } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';

interface SexoEdadImp {
  datosPiramidalesSexoEdad: DatosPiramidalesItem[] | null;
  labelIzquierdo: string;
  labelDerecho: string;
}

const SexoEdad: React.FC<SexoEdadImp> = ({ datosPiramidalesSexoEdad = null, labelIzquierdo, labelDerecho }) => {

  if (!datosPiramidalesSexoEdad) {
    return null;
  }

  const mujeresDatosPiramidales = datosPiramidalesSexoEdad
    .filter((item) => labelDerecho in item)
    .map((item) => item.Mujer)
    .filter((value): value is number => value !== undefined);
  const hombresDatosPiramidales = datosPiramidalesSexoEdad
    .filter((item) => labelIzquierdo in item)
    .map((item) => item.Hombre)
    .filter((value): value is number => value !== undefined);
  
  const mujeresMaxima = Math.max(...mujeresDatosPiramidales);
  const hombresMaxima = Math.min(...hombresDatosPiramidales);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={datosPiramidalesSexoEdad}
        layout="vertical"
        margin={{ top: 10, right: 60, left: 30, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          allowDecimals={false} 
          domain={[hombresMaxima * 1.1, mujeresMaxima * 1.1]}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis type="category" dataKey='grupo' width={110} />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" height={36} />
        <Bar dataKey={labelIzquierdo} fill="#5886A9" barSize={30}>
          <LabelList dataKey={labelIzquierdo} position="right" />
        </Bar>
        <Bar dataKey={labelDerecho} fill="#BE4D60" barSize={30}>
          <LabelList dataKey={labelDerecho} position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SexoEdad;
