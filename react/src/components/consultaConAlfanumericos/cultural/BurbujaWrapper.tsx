// src/components/consultaConAlfanumericos/cultural/BurbujaWrapper.tsx

import React, { useState } from 'react';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import MapaCultural from './MapaCultural';
import { CajaTitulo } from '../estilos';
import QueEstoyViendo from '../general/QueEstoyViendo';
import WrapperAnimadoParaHistorias from '../WrapperAnimadoParaHistorias';

interface CulturalGraficoBurbujaWrapperImp {
  datos: any;
  queEstoyViendo: { comunidadesGeoJson: any, territoriosGeoJson: any };
  modo: string | string[];
}

const CulturalGraficoBurbujaWrapper: React.FC<CulturalGraficoBurbujaWrapperImp> = ({ datos, queEstoyViendo, modo }) => {
  const [selectedOption, setSelectedOption] = useState('lenguas');
  const [mostrarMenosRepresentativo, setMostrarMenosRepresentativo] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const toggleRepresentacion = () => {
    setMostrarMenosRepresentativo(!mostrarMenosRepresentativo);
  };

  const renderMapaCultural = () => {
    let titulo = '';
    let datosFiltrados = [];
    let variable = '';
    let agregador = '';
    
    switch (selectedOption) {
      case 'lenguas':
        titulo = 'Distribución de Lenguas';
        datosFiltrados = datos.lenguas.rows;
        variable = 'lengua';
        agregador = 'comunidadId';
        break;
      case 'etnias':
        titulo = 'Distribución de Etnias';
        datosFiltrados = datos.etnias.rows;
        variable = 'etnia';
        agregador = 'comunidadId';
        break;
      case 'clanes':
        titulo = 'Distribución de Clanes';
        datosFiltrados = datos.clanes.rows;
        variable = 'clan';
        agregador = 'comunidadId';
        break;
      case 'pueblos':
        titulo = 'Distribución de Pueblos';
        datosFiltrados = datos.pueblos.rows;
        variable = 'pueblo';
        agregador = 'comunidadId';
        break;
      default:
        return null;
    }

    return (
      <>
        <WrapperAnimadoParaHistorias>
          <CajaTitulo>{titulo}</CajaTitulo>
          <div className={estilos.controls}>
            <select onChange={handleOptionChange} value={selectedOption}>
              <option value="lenguas">Lenguas</option>
              <option value="pueblos">Pueblos</option>
            </select>
            <button onClick={toggleRepresentacion}>
              {mostrarMenosRepresentativo ? 'Mostrar Más Representativo' : 'Mostrar Menos Representativo'}
            </button>
          </div>
          <MapaCultural
            territoriosGeoJson={queEstoyViendo.territoriosGeoJson}
            comunidadesGeoJson={queEstoyViendo.comunidadesGeoJson}
            modo={modo}
            datos={datosFiltrados}
            agregador={agregador}
            variable={variable}
            mostrarMenosRepresentativo={mostrarMenosRepresentativo}
            tipo={selectedOption}
          />
        </WrapperAnimadoParaHistorias>
        <QueEstoyViendo
          comunidades={queEstoyViendo.comunidadesGeoJson}
          territorios={queEstoyViendo.territoriosGeoJson}
        />
      </>
    );
  };

  if (validaDatosCulturales(datos, queEstoyViendo)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  return (
    <>
      {renderMapaCultural()}
    </>
  );
};

export default CulturalGraficoBurbujaWrapper;

const validaDatosCulturales = (datos: any, queEstoyViendo: { comunidadesGeoJson: any, territoriosGeoJson: any }) => {
  return !datos.lenguas ||
    !datos.etnias ||
    !datos.clanes ||
    !datos.pueblos ||
    !queEstoyViendo.comunidadesGeoJson ||
    !queEstoyViendo.territoriosGeoJson;
};
