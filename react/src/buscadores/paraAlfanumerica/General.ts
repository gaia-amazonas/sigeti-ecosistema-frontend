// src/buscadores/paraAlfanumerica/General.ts
import ComunidadesEnTerritorioDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import ComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorio';
import consultasGeneralesPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorios';
import consultasGeneralesPorComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTodosTerritorios';
import consultasGeneralesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesGeoJson,
    territorioGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexo(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familias(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexoEdad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);

  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesGeoJson,
    territorioGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesGeoJson,
    territorioGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexo(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familias(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexoEdad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorio.territorio(datosParaConsultar), modo)
  ]);

  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesGeoJson,
    territorioGeoJson
  };
};

export const buscarPorComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexo(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familias(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexoEdad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.comunidadesAgregadasEnTerritorios(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorios.territorios(datosParaConsultar), modo)
  ]);
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.sexo(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familias(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.sexoEdad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesAgregadasEnTerritorios(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorios.territorios(datosParaConsultar), modo)
  ]);
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  };
};

export const buscarPorComunidadesEnTodosTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexo(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familias(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexoEdad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar), modo),
    buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.comunidadesAgregadasEnTerritorios(datosParaConsultar), modo),
    buscarComunidades(consultasGeneralesPorComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo),
    buscarTerritorios(consultasGeneralesPorComunidadesEnTodosTerritorios.territorios(datosParaConsultar), modo)
  ]);

  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  ] = await Promise.all([
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.sexo, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familias, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.sexoEdad, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familiasPorComunidad, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.poblacionPorComunidad, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familiasConElectricidadPorComunidad, modo),
    buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesAgregadasEnTerritorios, modo),
    buscarComunidades(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios, modo),
    buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.territorios, modo)
  ]);

  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson,
    territoriosGeoJson
  };
};
