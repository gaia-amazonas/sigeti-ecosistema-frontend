// src/buscadores/paraAlfanumerica/dinamicas/Educacional.ts

import { buscarDatos } from 'buscadores/datosSQL';
import { EscolaridadPrimariaYSecundaria } from 'tipos/educacional/datosConsultados';

import consultasEducacionalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/educacional/dinamicas/porComunidadesEnTerritorio';
import consultasEducacionalesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/educacional/dinamicas/porTodasComunidadesEnTerritorio';
import consultasEducacionalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/educacional/dinamicas/porTodasComunidadesEnTodosTerritorios';


interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  edades: {edadMinima: number, edadMaxima: number},
  educacion: string,
  territoriosPrivados: string[]
): Promise<EscolaridadPrimariaYSecundaria> => {
  return await buscarDatos(consultasEducacionalesPorTodasComunidadesEnTerritorio.escolaridadPrimariaYSecundaria(datosParaConsultar, edades, educacion, territoriosPrivados), modo);
};


export const buscarPorComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  edades: {edadMinima: number, edadMaxima: number},
  educacion: string,
  territoriosPrivados: string[]
): Promise<EscolaridadPrimariaYSecundaria> => {
  return await buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridadPrimariaYSecundaria(datosParaConsultar, edades, educacion, territoriosPrivados), modo);
};

export const buscarPorComunidadesEnTodosTerritorios = async (datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  edades: {edadMinima: number, edadMaxima: number},
  educacion: string,
  territoriosPrivados: string[]
): Promise<EscolaridadPrimariaYSecundaria> => {
  return await buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridadPrimariaYSecundaria(datosParaConsultar, edades, educacion, territoriosPrivados), modo);
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  edades: {edadMinima: number, edadMaxima: number},
  educacion: string,
  territoriosPrivados: string[]
): Promise<EscolaridadPrimariaYSecundaria> => {
  return await buscarDatos(consultasEducacionalesPorTodasComunidadesEnTodosTerritorios.escolaridadPrimariaYSecundaria(datosParaConsultar, edades, educacion, territoriosPrivados), modo);
};