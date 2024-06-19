import React, { useState, useEffect } from 'react';

import General from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/General';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/datosConsultados/comunidadesEnTerritorio';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import { buscarDatosPorComunidadesEnTerritorio, buscarDatosParaTodosTerritoriosYComunidades, buscarDatosPorTerritorio } from 'buscadores/paraAlfanumerica';


interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface PestanhasImp {
  datosParaConsultar: DatosParaConsultar;
  reiniciar: () => void;
  modo: string;
}

interface DatosPorPestanhaImp {
  general: ComunidadesEnTerritorioDatosConsultados;
  cultural: any[];
  educacion: any[];
}


const comunidadesEnTerritorioDatosIniciales: ComunidadesEnTerritorioDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  comunidadesGeoJson: null,
  territorioGeoJson: null
};


const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [tipoConsulta, establecerTipoConsulta] = useState('');
  const [activo, establecerActivo] = useState('pestanha_general');
  const [comunidadesEnTerritorioDatosConsultados, establecerComunidadesEnTerritorioDatosConsultados] = useState<ComunidadesEnTerritorioDatosConsultados>(comunidadesEnTerritorioDatosIniciales);
  const [datosPorPestanha, establecerDatosPorPestanha] = useState<DatosPorPestanhaImp>({
    general: comunidadesEnTerritorioDatosIniciales,
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo]);

  useEffect(() => {
    establecerDatosPorPestanha({
      general: {
        sexo: comunidadesEnTerritorioDatosConsultados.sexo,
        familias: comunidadesEnTerritorioDatosConsultados.familias,
        sexoEdad: comunidadesEnTerritorioDatosConsultados.sexoEdad,
        familiasPorComunidad: comunidadesEnTerritorioDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: comunidadesEnTerritorioDatosConsultados.poblacionPorComunidad,
        comunidadesGeoJson: comunidadesEnTerritorioDatosConsultados.comunidadesGeoJson,
        territorioGeoJson: comunidadesEnTerritorioDatosConsultados.territorioGeoJson
      },
      cultural: [],
      educacion: []
    });
  }, [comunidadesEnTerritorioDatosConsultados]);

  const buscarDatosParaPestanha = async () => {
    if (datosParaConsultar.comunidadesId && datosParaConsultar.comunidadesId[0] !== 'Todas') {
      establecerComunidadesEnTerritorioDatosConsultados(await buscarDatosPorComunidadesEnTerritorio({ datosParaConsultar, modo }));
      establecerTipoConsulta('consultaComunidadesEnTerritorio');
    } else if (datosParaConsultar.territoriosId[0] === 'Todos' && datosParaConsultar.comunidadesId[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosParaTodosTerritoriosYComunidades(modo));
    } else if (datosParaConsultar.comunidadesId[0] === 'Todas') {
      establecerDatosConsultados(await buscarDatosPorTerritorio(datosParaConsultar, modo));
    } else {
      throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
    };
  };

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha active={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha active={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && <General datosGenerales={datosPorPestanha.general} modo={modo} />}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;