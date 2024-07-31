// src/components/consultaConAlfanumericos/general/FamiliasYPoblacion.tsx

import React, { useState, useEffect } from 'react';
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
import {
  FamiliasPorComunidad,
  PoblacionTotalPorComunidad,
  FamiliasConElectricidadPorComunidad
} from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';

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

const FamiliasYPoblacionYElectricidad: React.FC<FamiliasYPoblacionYElectricidadImp> = ({
  familiasPorComunidad,
  poblacionPorComunidad,
  familiasConElectricidadPorComunidad,
  comunidadesPorTerritorio
}) => {
  const allTerritorios = comunidadesPorTerritorio?.rows.map(row => row.territorioId) || [];
  const uniqueTerritorios = Array.from(new Set(allTerritorios));
  const [selectedTerritorio, setSelectedTerritorio] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTerritorio) {
      setSelectedTerritorio(uniqueTerritorios[0]);
    }
  }, [uniqueTerritorios]);

  if (!familiasPorComunidad || !poblacionPorComunidad || !familiasConElectricidadPorComunidad) {
    return <div>Cargando...</div>;
  }

  const comunidades = familiasPorComunidad.rows.map(row => row.comunidadNombre);
  const familias = familiasPorComunidad.rows.map(row => row.familias);
  const poblacionTotal = poblacionPorComunidad.rows.map(row => row.poblacionTotal);
  const familiasConElectricidad = familiasConElectricidadPorComunidad.rows.map(row => row.familias);

  const handleTerritorioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerritorio(event.target.value);
  };

  let filteredData = { comunidades, familias, poblacionTotal, familiasConElectricidad };

  if (comunidadesPorTerritorio && selectedTerritorio) {
    const comunidadTerritorioMap = mapeaComunidadesPorTerritorio(comunidadesPorTerritorio);
    const filteredIndices = comunidades
      .map((comunidad, index) => (comunidadTerritorioMap.get(comunidad) === selectedTerritorio ? index : -1))
      .filter(index => index !== -1);

    filteredData = {
      comunidades: filteredIndices.map(index => comunidades[index]),
      familias: filteredIndices.map(index => familias[index]),
      poblacionTotal: filteredIndices.map(index => poblacionTotal[index]),
      familiasConElectricidad: filteredIndices.map(index => familiasConElectricidad[index]),
    };
  }

  const datosParaGraficoConTerritorio = estructuraGraficoConTerritorio(filteredData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', width: '100%', height: '100vh' }}>
      { comunidadesPorTerritorio ? (
        <select onChange={handleTerritorioChange} value={selectedTerritorio || ''} style={{ marginBottom: '1rem' }}>
        { uniqueTerritorios.map(territorio => (
          <option key={territorio} value={territorio}>
            {territorio}
          </option>
        )) }
        </select>
        ) : (<p></p>)
      }

      <div style={{ width: '80%', flexGrow: 1 }}>
        <Bar data={datosParaGraficoConTerritorio} options={estilizaGraficoConTerritorio()} />
      </div>
    </div>
  );
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

const estructuraGraficoConTerritorio = ({
  comunidades,
  familias,
  poblacionTotal,
  familiasConElectricidad
}: DatosParaGraficoConTerritorio): ChartData<'bar'> => {
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
      }
    ],
  };
};

const estilizaGraficoConTerritorio = (): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: false,
      },
    },
  };
};

const mapeaComunidadesPorTerritorio = (comunidadesPorTerritorio: { rows: { territorioId: string, comunidadesId: string[] }[] }) => {
  const mapaEntreComunidadesYTerritorio = new Map<string, string>();
  comunidadesPorTerritorio.rows.forEach(({ territorioId, comunidadesId }) => {
    comunidadesId.forEach(comunidad => {
      mapaEntreComunidadesYTerritorio.set(comunidad, territorioId);
    });
  });
  return mapaEntreComunidadesYTerritorio;
};
