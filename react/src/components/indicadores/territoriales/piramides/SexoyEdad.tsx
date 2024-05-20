import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Label } from 'recharts';
import './SexoyEdad.css';

interface SexoyEdad {
  sexo: string;
  edad: number;
}

const SexoyEdadGraph: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sexoYEdades, setSexoYEdades] = useState<SexoyEdad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchSexoYEdades = async () => {
      try {
        const response = await axios.get<SexoyEdad[]>(`http://127.0.0.1:8000/indicadores/piramide_poblacional/territorio/${id}/`);
        setSexoYEdades(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchSexoYEdades();
  }, [id]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const chartData = processData(sexoYEdades)
    .map((group) => ({
      ...group,
      Hombres: -group.Hombres, // Negate the value for males to display on the left side
    }))
    .sort((a, b) => {
      const ageRangeA = a.ageGroup.split('-').map(Number);
      const ageRangeB = b.ageGroup.split('-').map(Number);
      return ageRangeB[0] - ageRangeA[0]; // Sort in descending order
    });

  const scaleFactor = windowWidth / 150; // Adjust the denominator to control scaling sensitivity

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="sexoyedad-container">
      <h1 className="sexoyedad-title">Sexo y Edades</h1>
      <div className="sexoyedad-chart-container">
        <div className="sexoyedad-chart">
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
                <Label value="Rangos de edad" offset={-10} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
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
                      x={x - scaleFactor * Math.abs(value)}
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
      </div>
    </div>
  );
};

export default SexoyEdadGraph;
