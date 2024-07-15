// src/buscadores/paraAlfanumerica/Cultural.ts

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';

import consultasCulturalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios';
import consultasCulturalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios';

import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [lenguas, etnias, clanes, pueblosPorTerritorio, comunidadesGeoJson, territorioGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.lenguas(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.clanes(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.pueblosPorTerritorio(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);
  return {
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    pueblosPorTerritorio: pueblosPorTerritorio,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territorioGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [lenguas, etnias, clanes, comunidadesGeoJson, territorioGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.sexoYLengua(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.clanes(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorio.territorio(datosParaConsultar), modo),
  ]);
  if (lenguas.rows.length === 0) lenguas.rows = [{lengua: 'Sin datos', conteo: 1}]
  return {
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    pueblosPorTerritorio: null,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territorioGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [lenguas, etnias, clanes, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.sexoYLengua(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.clanes(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.territorios(datosParaConsultar), modo)
  ]);
  return {
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    pueblosPorTerritorio: null,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [lenguas, etnias, clanes, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.sexoYLengua, modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.etnias, modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.clanes, modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios, modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.territorios, modo)
  ]);
  return {
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    pueblosPorTerritorio: null,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  };
};
