import React, { useState, useEffect } from 'react';

import GeneralTerritorio from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorio/General';
import GeneralTerritorios from 'components/consultaConAlfanumericos/general/comunidadesEnTerritorios/General';

import { ComunidadesEnTerritorioDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorio';
import { ComunidadesEnTerritoriosDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorios';

import BotonReiniciar from 'components/BotonReiniciar';
import { Contenedor, ListaPestanhas, EstiloPestanha, PanelPestanhas, Titulo } from 'components/consultaConAlfanumericos/estilos/Pestanhas';

import {
  buscarPorComunidadesEnTerritorio,
  buscarPorTodasComunidadesEnTerritorio,
  buscarPorComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTerritorios,
  buscarPorTodasComunidadesEnTodosTerritorios } from 'buscadores/paraAlfanumerica';

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
  const [todasComunidadesEnTerritoriosDatosConsultados, establecerTodasComunidadesEnTerritoriosDatosConsultados] = useState<ComunidadesEnTerritoriosDatosConsultados>(comunidadesEnTerritoriosDatosIniciales);
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
    console.log(activo);
  }, [activo]);

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

  useEffect(() => {
    establecerDatosPorPestanhaEnTerritorios({
      general: {
        sexo: todasComunidadesEnTerritoriosDatosConsultados.sexo,
        familias: todasComunidadesEnTerritoriosDatosConsultados.familias,
        sexoEdad: todasComunidadesEnTerritoriosDatosConsultados.sexoEdad,
        familiasPorComunidad: todasComunidadesEnTerritoriosDatosConsultados.familiasPorComunidad,
        poblacionPorComunidad: todasComunidadesEnTerritoriosDatosConsultados.poblacionPorComunidad,
        familiasConElectricidadPorComunidad: todasComunidadesEnTerritoriosDatosConsultados.familiasConElectricidadPorComunidad,
        comunidadesGeoJson: todasComunidadesEnTerritoriosDatosConsultados.comunidadesGeoJson,
        territoriosGeoJson: todasComunidadesEnTerritoriosDatosConsultados.territoriosGeoJson,
        comunidadesEnTerritorios: todasComunidadesEnTerritoriosDatosConsultados.comunidadesEnTerritorios
      },
      cultural: [],
      educacion: []
    });
    establecerTipoConsulta('enTerritorios');
  }, [todasComunidadesEnTerritoriosDatosConsultados]);

  const buscarDatosParaPestanha = async () => {
    if (enUnTerritorio(datosParaConsultar)) {
      await manejarUnTerritorioEspecifico(datosParaConsultar, modo);
      return;
    }
    if (enTerritorios(datosParaConsultar)) {
      await manejarVariosTerritorios(datosParaConsultar, modo);
      return;
    }
    if (esTodosLosTerritoriosYComunidades(datosParaConsultar)) {
      await manejarTodosTerritoriosYComunidades(datosParaConsultar, modo);
      return;
    }
    throw new Error(`Tipo de filtrado no manejado (comunidad: ${datosParaConsultar.comunidadesId}, territorio: ${datosParaConsultar.territoriosId})`);
  };

  const enUnTerritorio = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length === 1 && datos.territoriosId[0] !== 'Todos';
  };

  const enTerritorios = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length > 1;
  };

  const esTodosLosTerritoriosYComunidades = (datos: DatosParaConsultar) => {
    return datos.territoriosId.length === 1 && datos.territoriosId[0] === 'Todos' && datos.comunidadesId.length === 1 && datos.comunidadesId[0] === 'Todas';
  };

  const manejarUnTerritorioEspecifico = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      establecerComunidadesEnTerritorioDatosConsultados(await buscarPorComunidadesEnTerritorio(datos, modo));
    } else {
      establecerComunidadesEnTerritorioDatosConsultados(await buscarPorTodasComunidadesEnTerritorio(datos, modo));
    }
  };

  const manejarVariosTerritorios = async (datos: DatosParaConsultar, modo: string | string[]) => {
    if (datos.comunidadesId[0] !== 'Todas') {
      establecerComunidadesEnTerritoriosDatosConsultados(await buscarPorComunidadesEnTerritorios(datos, modo));
    } else {
      establecerTodasComunidadesEnTerritoriosDatosConsultados(await buscarPorTodasComunidadesEnTerritorios(datos, modo));
    }
  };

  const manejarTodosTerritoriosYComunidades = async (datos: DatosParaConsultar, modo: string | string[]) => {
    establecerComunidadesEnTerritoriosDatosConsultados(await buscarPorTodasComunidadesEnTodosTerritorios(datos, modo));
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
        {activo === 'pestanha_general' && tipoConsulta === 'enTerritorio' ? <GeneralTerritorio datosGenerales={datosPorPestanhaEnTerritorio.general} modo={modo} /> : <GeneralTerritorios datosGenerales={datosPorPestanhaEnTerritorios.general} modo={modo}/> }
        {activo === 'pestanha_cultural' && <div>en desarrollo...</div>}
        {activo === 'pestanha_educacional' && <div>en desarrollo...</div>}
      </PanelPestanhas>
    </Contenedor>
  );
};

export default Pestanhas;