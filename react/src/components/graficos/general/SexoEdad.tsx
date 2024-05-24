import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';

interface SexoEdadProps {
  pyramidData: any[];
  mujeresPorEdadMaximo: number;
  hombresPorEdadMaximo: number;
}

const SexoEdad: React.FC<SexoEdadProps> = ({ pyramidData, mujeresPorEdadMaximo, hombresPorEdadMaximo }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={pyramidData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 70, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          allowDecimals={false} 
          domain={[-mujeresPorEdadMaximo * 1.5, hombresPorEdadMaximo * 1.5]}
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
