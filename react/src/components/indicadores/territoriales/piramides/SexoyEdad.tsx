import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Label } from 'recharts';

interface SexoyEdad {
  sexo: string;
  edad: number;
}

const SexoyEdadGraph: React.FC = () => {
  const [sexoYEdades, setSexoYEdades] = useState<SexoyEdad[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSexoYEdades = async () => {
      try {
        const response = await axios.get<SexoyEdad[]>('http://127.0.0.1:8000/indicadores/piramide_poblacional/1/');
        setSexoYEdades(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchSexoYEdades();
  }, []);

  // Function to process data into age groups
  const processData = (data: SexoyEdad[]) => {
    const ageGroups: { [key: string]: { ageGroup: string; Hombres: number; Mujeres: number } } = {};

    data.forEach(({ sexo, edad }) => {
      if (edad === null) return;
      const ageGroup = `${Math.floor(edad / 5) * 5}-${Math.floor(edad / 5) * 5 + 4}`;

      if (!ageGroups[ageGroup]) {
        ageGroups[ageGroup] = { ageGroup, Hombres: 0, Mujeres: 0 };
      }
      ageGroups[ageGroup][sexo === "Hombre" ? "Hombres" : "Mujeres"] += 1;
    });

    return Object.values(ageGroups);
  };

  const chartData = processData(sexoYEdades).map((group) => ({
    ...group,
    Hombres: -group.Hombres, // Negate the value for males to display on the left side
  }));

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Sexo y Edades Graph</h1>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(tick) => Math.abs(tick)}
          >
            <Label value="Número de personas" offset={-40} position="insideBottom" />
          </XAxis>
          <YAxis type="category" dataKey="ageGroup">
            <Label value="Rango de edad" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip formatter={(value) => Math.abs(Number(value))} />
          <Legend />
          <Bar dataKey="Hombres" fill="#8884d8">
            <LabelList
              dataKey="Hombres"
              position="left"
              formatter={(value) => Math.abs(value)}
              content={({ x, y, value }) => (
                <text
                  x={x - 5 * Math.abs(value)}
                  y={y + 5}
                  textAnchor="end"
                  fill="#8884d8"
                >{Math.abs(value)}</text>
              )}
            />
          </Bar>
          <Bar dataKey="Mujeres" fill="#82ca9d">
            <LabelList
              dataKey="Mujeres"
              position="right"
              content={({ x, y, value, width }) => (
                <text
                  x={x + width + 10}
                  y={y + 5}
                  textAnchor="start"
                  fill="#82ca9d"
                >{value}</text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SexoyEdadGraph;
