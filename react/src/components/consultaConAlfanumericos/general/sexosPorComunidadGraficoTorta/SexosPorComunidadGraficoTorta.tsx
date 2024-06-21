// src/components/consultaConAlfanumericos/general/GraficoTorta.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Plugin } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface SexosPorComunidadGraficoTortaImp {
  hombres: number;
  mujeres: number;
}

// Plugin to display text inside each pie slice
const textoEnTrozo: Plugin<'pie'> = {
  id: 'textoEnTrozo',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const datasets = chart.data.datasets;
    if (!datasets || !chart.data.labels) return;
    datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((element, index) => {
        const centerPoint = element.tooltipPosition(true);
        const value = dataset.data[index] as number;
        const label = chart.data.labels && chart.data.labels[index] === 'Hombres' ? `H: ${value}` : `M: ${value}`;
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, centerPoint.x, centerPoint.y);
      });
    });
  }
};

const SexosPorComunidadGraficoTorta: React.FC<SexosPorComunidadGraficoTortaImp> = ({ hombres, mujeres }) => {
  const data = {
    labels: ['Hombres', 'Mujeres'],
    datasets: [
      {
        data: [hombres, mujeres],
        backgroundColor: ['#5886A9', '#BE4D60'],
        hoverBackgroundColor: ['#5886A9', '#BE4D60'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return <Pie data={data} options={options} plugins={[textoEnTrozo]} />;
};

export default SexosPorComunidadGraficoTorta;