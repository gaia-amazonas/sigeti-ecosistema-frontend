// src/buscadores/paraAlfanumerica.ts
import { ComunidadesEnTerritorioDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorio';
import { ComunidadesEnTerritoriosDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorios';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/porComunidadesEnTerritorio';
import consultasGeneralesPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/porComunidadesEnTerritorios';
import consultasGeneralesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/porTodasComunidadesEnTerritorio';

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

export const buscarPorTodasComunidadesTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  
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

  // buscarPorTodasComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTodosTerritorios