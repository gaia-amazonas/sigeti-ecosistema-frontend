// src/components/consultaConAlfanumericos/general/FamiliasYPoblacionYElectricidad.tsx
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

import { FamiliasPorComunidad, PoblacionTotalPorComunidad, FamiliasConElectricidadPorComunidad } from 'tipos/datosConsultados/comunidadesEnTerritorio';


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
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidad | null;
}


const FamiliasYPoblacionYElectricidad: React.FC<FamiliasYPoblacionImp> = ({ familiasPorComunidad, poblacionPorComunidad, familiasConElectricidadPorComunidad }) => {
  if (!familiasPorComunidad || !poblacionPorComunidad || !familiasConElectricidadPorComunidad) {
    return <div>Cargando...</div>;
  }

  const comunidades = familiasPorComunidad.rows.map(row => row.comunidadNombre);
  const familias = familiasPorComunidad.rows.map(row => row.familiasCantidad);
  const poblacionTotal = poblacionPorComunidad.rows.map(row => row.poblacionTotal);
  const familiasConElectricidad = familiasConElectricidadPorComunidad.rows.map(row => row.familiasCantidad);

  const datos: ChartData<'bar'> = {
    labels: comunidades,
    datasets: [
      {
        label: 'Familias',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: familias,
      },
      {
        label: 'Población',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: poblacionTotal,
      },
      {
        label: 'Familias con Electricidad',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: familiasConElectricidad,
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

export default FamiliasYPoblacionYElectricidad;
