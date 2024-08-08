// src/components/consultaConAlfanumericos/cultural/BurbujaWrapper.tsx

import React, { useState } from 'react';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import MapaCultural from './MapaCultural';
import ContenedorContexto from '../ContenedorContexto';
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
          <ContenedorContexto texto="El siguiente mapa identifica la distribución de pueblos
          indígenas y hablantes de lenguas tradicionales. Los pueblos indígenas se han constituido 
          espacialmente en el territorio por distintas dinámicas de movilidad y relacionamiento social, 
          que ahora definen la diversidad étnica y diversidad lingüística en el territorio." />

          <ContenedorContexto texto= 'Selecciona de la lista desplegable:' />

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
