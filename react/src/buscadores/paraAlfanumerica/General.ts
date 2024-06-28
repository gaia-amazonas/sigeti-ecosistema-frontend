// src/buscadores/paraAlfanumerica/General.ts
import { ComunidadesEnTerritorioDatosConsultados } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorio';
import { ComunidadesEnTerritoriosDatosConsultados } from 'tipos/general/deDatosConsultados/comunidadesEnTerritorios';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorio';
import consultasGeneralesPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexo = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexo(datosParaConsultar), modo);
  const familias = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familias(datosParaConsultar), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexoEdad(datosParaConsultar), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesGeoJson: comunidadesGeoJson,
    territorioGeoJson: territorioGeoJson
  }
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexo = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexo(datosParaConsultar), modo);
  const familias = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familias(datosParaConsultar), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexoEdad(datosParaConsultar), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorio.territorio(datosParaConsultar), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesGeoJson: comunidadesGeoJson,
    territorioGeoJson: territorioGeoJson
  }
};

export const buscarPorComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const sexo = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexo(datosParaConsultar), modo);
  const familias = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familias(datosParaConsultar), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexoEdad(datosParaConsultar), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar), modo);
  const comunidadesAgregadasEnTerritorios = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.comunidadesAgregadasEnTerritorios(datosParaConsultar), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorios.territorios(datosParaConsultar), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }

}

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const sexo = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.sexo(datosParaConsultar), modo);
  const familias = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familias(datosParaConsultar), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.sexoEdad(datosParaConsultar), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar), modo);
  const comunidadesAgregadasEnTerritorios = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesAgregadasEnTerritorios(datosParaConsultar), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorios.territorios(datosParaConsultar), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }
}


export const buscarPorTodasComunidadesEnTodosTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const sexo = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.sexo, modo);
  const familias = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familias, modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.sexoEdad, modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familiasPorComunidad, modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.poblacionPorComunidad, modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.familiasConElectricidadPorComunidad, modo);
  const comunidadesAgregadasEnTerritorios = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesAgregadasEnTerritorios, modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios, modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTodosTerritorios.territorios, modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesEnTerritorios: comunidadesAgregadasEnTerritorios,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }
}