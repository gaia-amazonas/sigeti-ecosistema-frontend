// src/buscadores/paraAlfanumerica.ts
import ComunidadesEnTerritorioDatosConsultados from 'tipos/datosConsultados/comunidadesEnTerritorio';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/porComunidadesEnTerritorio';
import consultasGeneralesTodosGeoTerritorios from 'consultas/bigQuery/alfanumerico/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/bigQuery/alfanumerico/todasGeoComunidadesPorTerritorio';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface BuscarDatosPorComunidadesEnTerritorioImp {
  datosParaConsultar: DatosParaConsultar;
  modo: string | string[];
}


export const buscarDatosPorComunidadesEnTerritorio = async ({datosParaConsultar, modo}: BuscarDatosPorComunidadesEnTerritorioImp): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  
  const sexo = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexo(datosParaConsultar.comunidadesId), modo);
  const familias = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familias(datosParaConsultar.comunidadesId), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexoEdad(datosParaConsultar.comunidadesId), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar.comunidadesId), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar.comunidadesId), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar.comunidadesId), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar.comunidadesId), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar.comunidadesId), modo);
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

export const buscarDatosParaTodosTerritoriosYComunidades = async (modo: string | string[]) => {
  
  const sexo = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo, modo);
  const familias = await buscarDatos(consultasGeneralesTodosGeoTerritorios.familias, modo);
  const sexo_edad = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo_edad, modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesTodosGeoTerritorios.comunidades_en_territorio, modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodosGeoTerritorios.territorio, modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexo_edad,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }

};

export const buscarDatosPorTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]) => {
  
  const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datosParaConsultar.territoriosId), modo);
  const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datosParaConsultar.territoriosId), modo);
  const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datosParaConsultar.territoriosId), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datosParaConsultar.territoriosId), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territoriosId), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }

};