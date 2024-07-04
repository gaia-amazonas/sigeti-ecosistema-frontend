// src/buscadores/paraAlfanumerica/Educacional.ts

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/educacional/datosConsultados';
import consultasEducacionalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/educacional/porComunidadesEnTerritorio';
import consultasEducacionalesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTerritorio';
import consultasEducacionalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTodosTerritorios';


interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
    buscarTerritorios(consultasEducacionalesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo),
    buscarComunidades(consultasEducacionalesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo)
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
    buscarTerritorios(consultasEducacionalesPorTodasComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarComunidades(consultasEducacionalesPorTodasComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
    buscarComunidades(consultasEducacionalesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasEducacionalesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad, comunidadesGeoJson, territoriosGeoJson] = await Promise.all([
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.escolaridadJoven, modo),
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.escolaridad, modo),
    buscarComunidades(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios, modo),
    buscarTerritorios(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.territorios, modo),
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};