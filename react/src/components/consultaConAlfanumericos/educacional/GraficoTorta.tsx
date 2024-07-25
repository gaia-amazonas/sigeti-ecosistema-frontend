// src/components/consultaConAlfanumericos/educacional/GraficoTorta.tsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface GraficoTortaProps {
  si: number;
  no: number;
}

const GraficoTorta: React.FC<GraficoTortaProps> = ({ si, no }) => {
  const data = {
    labels: ['Sí', 'No'],
    datasets: [
      {
        data: [si, no],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: 'white',
        formatter: (value: number) => value,
        font: {
          weight: 'bold' as const,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default GraficoTorta;