import React, { useState, useEffect } from 'react';

import GeneralTerritorio from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/General';
import GeneralTerritorios from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorios/General';

import { ComunidadesEnTerritorioDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorio';
import { ComunidadesEnTerritoriosDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorios';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import {
  buscarPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesTerritorio,
  buscarPorComunidadesEnTerritorios } from 'buscadores/paraAlfanumerica';

  // buscarPorComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTodosTerritorios } from 'buscadores/paraAlfanumerica';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface PestanhasImp {
  datosParaConsultar: DatosParaConsultar;
  reiniciar: () => void;
  modo: string;
}

interface DatosPorPestanhaEnTerritorioImp {
  general: ComunidadesEnTerritorioDatosConsultados;
  cultural: any[];
  educacion: any[];
}

interface DatosPorPestanhaEnTerritoriosImp {
  general: ComunidadesEnTerritoriosDatosConsultados;
  cultural: any[];
  educacion: any[];
}

const comunidadesEnTerritorioDatosIniciales: ComunidadesEnTerritorioDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  familiasConElectricidadPorComunidad: null,
  comunidadesGeoJson: null,
  territorioGeoJson: null
};

const comunidadesEnTerritoriosDatosIniciales: ComunidadesEnTerritoriosDatosConsultados = {
  sexo: null,
  familias: null,
  sexoEdad: null,
  familiasPorComunidad: null,
  poblacionPorComunidad: null,
  familiasConElectricidadPorComunidad: null,
  comunidadesGeoJson: null,
  territoriosGeoJson: null,
  comunidadesEnTerritorios: null
};

const Pestanhas: React.FC<PestanhasImp> = ({ datosParaConsultar, reiniciar, modo }) => {
  const [activo, establecerActivo] = useState('pestanha_general');
  const [tipoConsulta, establecerTipoConsulta] = useState('');
  const [comunidadesEnTerritorioDatosConsultados, establecerComunidadesEnTerritorioDatosConsultados] = useState<ComunidadesEnTerritorioDatosConsultados>(comunidadesEnTerritorioDatosIniciales);
  const [comunidadesEnTerritoriosDatosConsultados, establecerComunidadesEnTerritoriosDatosConsultados] = useState<ComunidadesEnTerritoriosDatosConsultados>(comunidadesEnTerritoriosDatosIniciales);
  const [datosPorPestanhaEnTerritorio, establecerDatosPorPestanhaEnTerritorio] = useState<DatosPorPestanhaEnTerritorioImp>({
    general: comunidadesEnTerritorioDatosIniciales,
    cultural: [],
    educacion: []
  });
  const [datosPorPestanhaEnTerritorios, establecerDatosPorPestanhaEnTerritorios] = useState<DatosPorPestanhaEnTerritoriosImp>({
    general: comunidadesEnTerritoriosDatosIniciales,
    cultural: [],
    educacion: []
  })

  useEffect(() => {
    buscarDatosParaPestanha();
  }, [datosParaConsultar, modo]);

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorio({
      general: {
        sexo: comunidadesEnTerritorioDatosConsultados.sexo,
        familias: comunidadesEnTerritorioDatosConsultados.familias,
        sexoEdad: comunidadesEnTerritorioDatosConsultados.sexoEdad,
        familiasPorComunidad: comunidadesEnTerritorioDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: comunidadesEnTerritorioDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: comunidadesEnTerritorioDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: comunidadesEnTerritorioDatosConsultados.comunidadesGeoJson,
        territorioGeoJson: comunidadesEnTerritorioDatosConsultados.territorioGeoJson
      },
      cultural: [],
      educacion: []
    });
    establecerTipoConsulta('enTerritorio');
  }, [comunidadesEnTerritorioDatosConsultados]);

  useEffect(() => {
    console.log("@@@@@@@@@@@@@@@@", comunidadesEnTerritoriosDatosConsultados.comunidadesEnTerritorios);
    establecerDatosPorPestanhaEnTerritorios({
      general: {
        sexo: comunidadesEnTerritoriosDatosConsultados.sexo,
        familias: comunidadesEnTerritoriosDatosConsultados.familias,
        sexoEdad: comunidadesEnTerritoriosDatosConsultados.sexoEdad,
        familiasPorComunidad: comunidadesEnTerritoriosDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: comunidadesEnTerritoriosDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: comunidadesEnTerritoriosDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: comunidadesEnTerritoriosDatosConsultados.comunidadesGeoJson,
        territoriosGeoJson: comunidadesEnTerritoriosDatosConsultados.territoriosGeoJson,
        comunidadesEnTerritorios: comunidadesEnTerritoriosDatosConsultados.comunidadesEnTerritorios
      },
      cultural: [],
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [comunidadesEnTerritoriosDatosConsultados]);

  const buscarDatosParaPestanha = async () => { // fragmentar estoooooooooooooooooooooo
    let consultaValida: boolean = false;
    if (datosParaConsultar.territoriosId.length === 1) {
      if (datosParaConsultar.comunidadesId[0] !== 'Todas') {
        establecerComunidadesEnTerritorioDatosConsultados(await buscarPorComunidadesEnTerritorio(datosParaConsultar, modo));
        consultaValida = !consultaValida;
      } else {
        establecerComunidadesEnTerritorioDatosConsultados(await buscarPorTodasComunidadesTerritorio(datosParaConsultar, modo));
        consultaValida = !consultaValida;
      }
    }
    if (datosParaConsultar.territoriosId.length > 1) {
      if (datosParaConsultar.territoriosId[0] !== 'Todas') {
        establecerComunidadesEnTerritoriosDatosConsultados(await buscarPorComunidadesEnTerritorios(datosParaConsultar, modo));
        consultaValida = !consultaValida;
      } else {
        establecerTodasComunidadesEnTerritoriosDatosConsultados(await buscarPorComunidadesEnTerritorios({ datosParaConsultar, modo}));
        consultaValida = !consultaValida;
      }
    }
    if (!consultaValida) {
      throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
    };
  };

  return (
    <Contenedor>
      <BotonReiniciar onClick={reiniciar} />
      <Titulo>Temáticas</Titulo>
      <ListaPestanhas>
        <EstiloPestanha $activo={activo === 'pestanha_general'} onClick={() => establecerActivo('pestanha_general')}>General</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanha_cultural'} onClick={() => establecerActivo('pestanha_cultural')}>Cultural</EstiloPestanha>
        <EstiloPestanha $activo={activo === 'pestanha_educacional'} onClick={() => establecerActivo('pestanha_educacional')}>Educación</EstiloPestanha>
      </ListaPestanhas>
      <PanelPestanhas>
        {activo === 'pestanha_general' && tipoConsulta === 'enTerritorio' ? <GeneralTerritorio datosGenerales={datosPorPestanhaEnTerritorio.general} modo={modo} /> : <GeneralTerritorios datosGenerales={datosPorPestanhaEnTerritorios.general} modo={modo}/>}
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;