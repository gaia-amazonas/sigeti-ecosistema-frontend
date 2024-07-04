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
    buscarComunidades(consultasEducacionalesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo),
    buscarTerritorios(consultasEducacionalesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo)
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad] = await Promise.all([
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: null,
    comunidadesGeoJson: null
  };
};

export const buscarPorComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad, ] = await Promise.all([
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: null,
    comunidadesGeoJson: null
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad] = await Promise.all([
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.escolaridadJoven, modo),
    buscarDatos(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.escolaridad, modo),
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
    territoriosGeoJson: null,
    comunidadesGeoJson: null
  };
};