// src/components/consultaConAlfanumericos/SexoEdad.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Label } from 'recharts';

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

  const yLabelsOrder = [
    "Ninguna",
    "Preescolar",
    "Primaria",
    "Media",
    "Secundaria",
    "Universitaria Incompleta",
    "Tecnico",
    "Tecnologico",
    "Universitaria Completa",
    "NSNR"
  ];
  
  const sortedData = datosPiramidalesSexoEdad.sort((a, b) => {
    return yLabelsOrder.indexOf(a.grupo) - yLabelsOrder.indexOf(b.grupo);
  });

  const mujeresDatosPiramidales = sortedData
    .filter((item) => labelDerecho in item)
    .map((item) => item.Mujer)
    .filter((value): value is number => value !== undefined);
  const hombresDatosPiramidales = sortedData
    .filter((item) => labelIzquierdo in item)
    .map((item) => item.Hombre)
    .filter((value): value is number => value !== undefined);
  
  const mujeresMaxima = Math.max(...mujeresDatosPiramidales);
  const hombresMinima = Math.min(...hombresDatosPiramidales);

  const range = mujeresMaxima - hombresMinima;
  const padding = 0.1 * range;

  const xAxisDomain = [
    Math.min(hombresMinima - padding, 0),
    mujeresMaxima + padding
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          allowDecimals={false} 
          domain={xAxisDomain}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis type="category" dataKey='grupo' width={110} />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" height={36} />
        <Bar dataKey={labelIzquierdo} fill="#5886A9" barSize={30}>
          <Label position="insideTop" angle={0} dy={-10} fill="#000" />
        </Bar>
        <Bar dataKey={labelDerecho} fill="#BE4D60" barSize={30}>
          <Label position="insideTop" angle={0} dy={-10} fill="#000" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SexoEdad;
