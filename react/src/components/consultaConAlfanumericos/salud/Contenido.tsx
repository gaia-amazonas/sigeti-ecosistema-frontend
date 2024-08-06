// src/components/consultaConAlfanumericos/salud/Contenido.tsx

import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useUser } from '../../../context/UserContext';
import estilos from 'estilosParaMapas/ParaMapas.module.css';
import WrapperAnimadoParaHistorias from '../WrapperAnimadoParaHistorias';
import { CajaTitulo } from '../estilos';
import DatosConsultados from 'tipos/salud/datosConsultados';
import MujeresEnEdadFertilMap from './MujeresEnEdadFertil';
import ChagrasMap from './Chagras';
import ContenedorContexto from '../ContenedorContexto';

interface MapComponentProps {
  datos: DatosConsultados;
}

const MapComponent: React.FC<MapComponentProps> = ({ datos }) => {
  const [variableSeleccionada, setVariableSeleccionada] = useState<'chagrasPorPersona' | 'chagrasPorFamilia'>('chagrasPorPersona');
  const [zoomNivel, establecerZoomNivel] = useState<number>(6);
  const { user } = useUser();

  if (datosSaludInvalidos(datos)) {
    return (
      <div className={estilos['superposicionCargaConsultaAlfanumerica']}>
        <div className={estilos.spinner}></div>
      </div>
    );
  }

  const { mujeresEnEdadFertil, comunidadesGeoJson, territoriosGeoJson, chagrasPorPersonaYFamilia } = datos;

  return (
    <>
      { user?.role === 'admin' && (
        <WrapperAnimadoParaHistorias>
          <CajaTitulo>Mujeres En Edad Fértil</CajaTitulo>
          <MujeresEnEdadFertilMap
            mujeresEnEdadFertil={mujeresEnEdadFertil}
            comunidadesGeoJson={comunidadesGeoJson}
            territoriosGeoJson={territoriosGeoJson}
            zoomNivel={zoomNivel}
            establecerZoomNivel={establecerZoomNivel}
          />
        </WrapperAnimadoParaHistorias>
      )}
      <WrapperAnimadoParaHistorias>
        <CajaTitulo>Población y Número de Chagras</CajaTitulo>
        <ChagrasMap
          chagrasPorPersonaYFamilia={chagrasPorPersonaYFamilia}
          comunidadesGeoJson={comunidadesGeoJson}
          territoriosGeoJson={territoriosGeoJson}
          variableSeleccionada={variableSeleccionada}
          zoomNivel={zoomNivel}
          establecerZoomNivel={establecerZoomNivel}
          setVariableSeleccionada={setVariableSeleccionada}
        />
        <ContenedorContexto texto={`Zoom en el mapa para ver la cantidad de chagras por ${formateaVariableSeleccionada(variableSeleccionada)}`}></ContenedorContexto>
      </WrapperAnimadoParaHistorias>
    </>
  );
};

export default MapComponent;


const datosSaludInvalidos = (datosSalud: DatosConsultados) => {
  return !datosSalud.comunidadesGeoJson ||
    !datosSalud.mujeresEnEdadFertil ||
    !datosSalud.territoriosGeoJson;
};

const formateaVariableSeleccionada = (variable: string) => {
  return variable === 'chagrasPorFamilia' ? 'familias' : 'personas'
}