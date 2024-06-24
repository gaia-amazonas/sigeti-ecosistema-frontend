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

interface FamiliasYPoblacionYElectricidadImp {
  familiasPorComunidad: FamiliasPorComunidad | null;
  poblacionPorComunidad: PoblacionTotalPorComunidad | null;
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidad | null;
  comunidadesPorTerritorio?: { rows: { territorioId: string, comunidadesId: string[] }[] } | null;
}


const FamiliasYPoblacionYElectricidad: React.FC<FamiliasYPoblacionYElectricidadImp> = ({ familiasPorComunidad, poblacionPorComunidad, familiasConElectricidadPorComunidad, comunidadesPorTerritorio }) => {
  if (!familiasPorComunidad || !poblacionPorComunidad || !familiasConElectricidadPorComunidad) {
    return <div>Cargando...</div>;
  }
  const comunidades = familiasPorComunidad.rows.map(row => row.comunidadNombre);
  const familias = familiasPorComunidad.rows.map(row => row.familias);
  const poblacionTotal = poblacionPorComunidad.rows.map(row => row.poblacionTotal);
  const familiasConElectricidad = familiasConElectricidadPorComunidad.rows.map(row => row.familias);

  if (!comunidadesPorTerritorio) {
    const datosParaGraficoConTerritorio = estructuraGraficoConTerritorio({comunidades, familias, poblacionTotal, familiasConElectricidad});
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '1rem', paddingRight: '1rem', width: '100%' }}>
        <div style={{ width: '80%', height: '80%' }}>
          <Bar data={datosParaGraficoConTerritorio} options={estilizaGraficoConTerritorio()} />
        </div>
      </div>
    );
  }

  if (comunidadesPorTerritorio) {

    const comunidadTerritorioMap = mapeaComunidadesPorTerritorio(comunidadesPorTerritorio);
    const datosAgrupados = agrupaDatosPorTerritorio(comunidades, familias, poblacionTotal, familiasConElectricidad, comunidadTerritorioMap);
    const charts = Object.keys(datosAgrupados).map(territorio => {
      const comunidadesPorTerritorio = datosAgrupados[territorio];
      const datosComunitariosPorTerritorio = estructuraGraficoConTerritorios(comunidadesPorTerritorio);
      return (
        <div key={territorio} style={{ marginBottom: '2rem', width: '80%', height: '80%' }}>
          <h3>{territorio}</h3>
          <Bar data={datosComunitariosPorTerritorio} options={estilizaGraficoConTerritorios(datosComunitariosPorTerritorio, territorio)} />
        </div>
      );
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem', width: '100%' }}>
        {charts}
      </div>
    );

  }

};

export default FamiliasYPoblacionYElectricidad;


interface DatosAgrupados {
  comunidades: string[];
  familias: number[];
  poblacionTotal: number[];
  familiasConElectricidad: number[];
}

type DatosParaGraficoConTerritorio = {
  comunidades: string[];
  familias: number[];
  poblacionTotal: number[];
  familiasConElectricidad: number[];
};

const estructuraGraficoConTerritorio = ({comunidades, familias, poblacionTotal, familiasConElectricidad}: DatosParaGraficoConTerritorio): ChartData<'bar'> => {
    return {
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
}

const estructuraGraficoConTerritorios = (datosPorTerritorio: DatosAgrupados): ChartData<'bar'> => {
  return {
    labels: datosPorTerritorio.comunidades,
    datasets: [
      {
        label: 'Familias',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: datosPorTerritorio.familias,
      },
      {
        label: 'Población',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: datosPorTerritorio.poblacionTotal,
      },
      {
        label: 'Familias con Electricidad',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 20,
        data: datosPorTerritorio.familiasConElectricidad,
      },
    ],
  };
};


const estilizaGraficoConTerritorio = (): ChartOptions<'bar'> => {
  return {
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
}

const estilizaGraficoConTerritorios = (datosAgrupados: ChartData<'bar'>, territorio: string): ChartOptions<'bar'> => {
  return {
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
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            return `${datosAgrupados.labels![index]} (${territorio})`;
          },
        },
      },
    },
  };
}

const mapeaComunidadesPorTerritorio = (comunidadesPorTerritorio: { rows: { territorioId: string, comunidadesId: string[] }[] }) => {
  const mapaEntreComunidadesYTerritorio = new Map<string, string>();
  comunidadesPorTerritorio.rows.forEach(({ territorioId, comunidadesId }) => {
    comunidadesId.forEach(comunidad => {
      mapaEntreComunidadesYTerritorio.set(comunidad, territorioId);
    });
  });
  return mapaEntreComunidadesYTerritorio;
}

const agrupaDatosPorTerritorio = (
  comunidades: string[],
  familias: number[],
  poblacionTotal: number[],
  familiasConElectricidad: number[],
  comunidadTerritorioMap: Map<string, string>
): Record<string, DatosAgrupados> => {
  return comunidades.reduce((acc, comunidad, index) => {
    const territorio = comunidadTerritorioMap.get(comunidad) || 'Unknown';
    if (!acc[territorio]) {
      acc[territorio] = { comunidades: [], familias: [], poblacionTotal: [], familiasConElectricidad: [] };
    }
    acc[territorio].comunidades.push(comunidad);
    acc[territorio].familias.push(familias[index]);
    acc[territorio].poblacionTotal.push(poblacionTotal[index]);
    acc[territorio].familiasConElectricidad.push(familiasConElectricidad[index]);
    return acc;
  }, {} as Record<string, DatosAgrupados>);
};