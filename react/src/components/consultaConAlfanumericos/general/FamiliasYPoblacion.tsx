// src/components/FamiliasYPoblacionGrafico.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { FamiliasPorComunidad, PoblacionTotalPorComunidad } from 'tipos/datosConsultados/comunidadesEnTerritorio';

// Register the necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FamiliasYPoblacionImp {
  familiasPorComunidad: FamiliasPorComunidad | null;
  poblacionPorComunidad: PoblacionTotalPorComunidad | null;
}

const FamiliasYPoblacion: React.FC<FamiliasYPoblacionImp> = ({ familiasPorComunidad, poblacionPorComunidad }) => {
  if (!familiasPorComunidad || !poblacionPorComunidad) {
    return <div>Cargando...</div>;
  }

  const comunidades = familiasPorComunidad.rows.map(row => row.comunidadNombre);
  const familiasData = familiasPorComunidad.rows.map(row => row.familias);
  const poblacionData = poblacionPorComunidad.rows.map(row => row.poblacionTotal);

  const datos: ChartData<'bar'> = {
    labels: comunidades,
    datasets: [
      {
        label: 'Familias',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: familiasData,
      },
      {
        label: 'Población',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: poblacionData,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '1rem', paddingRight: '1rem', width: '100%' }}>
      <div style={{ width: '80%', height: '80%' }}>
        <Bar data={datos} options={options} />
      </div>
    </div>
  );
};

export default FamiliasYPoblacion;
