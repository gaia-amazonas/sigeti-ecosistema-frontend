// src/buscadores/paraAlfanumerica/Cultural.ts

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';

import consultasCulturalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios';
import consultasCulturalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios';

import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [lenguas, etnias, clanes, pueblos, comunidadesGeoJson, territorioGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.lenguas(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.clanes(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.pueblos(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);
  return {
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    pueblos: pueblos,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territorioGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [pueblos, lenguas, etnias, clanes, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.pueblos(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.lenguas(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.clanes(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorios.territorios(datosParaConsultar), modo),
  ]);
  if (lenguas.rows.length === 0) lenguas.rows = [{lengua: 'Sin datos', conteo: 1}]
  console.log(pueblos);
  return {
    pueblos: pueblos,
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [pueblos, lenguas, etnias, clanes, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.pueblos, modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.lenguas, modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.etnias, modo),
    buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.clanes, modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios, modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.territorios, modo)
  ]);
  return {
    pueblos: pueblos,
    lenguas: lenguas,
    etnias: etnias,
    clanes: clanes,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  };
};
