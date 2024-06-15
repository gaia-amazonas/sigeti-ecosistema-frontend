// src/buscadores/paraAlfanumerica.ts
import DatosConsultados from 'tipos/datosConsultados';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorTerritorio from 'consultas/bigQuery/alfanumerico/porTerritorios';
import consultasGeneralesTodosGeoTerritorios from 'consultas/bigQuery/alfanumerico/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/bigQuery/alfanumerico/todasGeoComunidadesPorTerritorio';

interface DatosParaConsultar {
  territorios_id: string[];
  comunidades_id: string[];
}


export const buscarDatosPorTerritorioYComunidad = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<DatosConsultados> => {

  const sexo = await buscarDatos(consultasGeneralesPorTerritorio.sexo(datosParaConsultar.comunidades_id), modo);
  const familias = await buscarDatos(consultasGeneralesPorTerritorio.familias(datosParaConsultar.comunidades_id), modo);
  const sexo_edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datosParaConsultar.comunidades_id), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorTerritorio.comunidades_en_territorio(datosParaConsultar.comunidades_id), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTerritorio.territorio(datosParaConsultar.comunidades_id), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
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
    sexo_edad: sexo_edad,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }

};

export const buscarDatosPorTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]) => {
  console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC");
  const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datosParaConsultar.territorios_id), modo);
  const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datosParaConsultar.territorios_id), modo);
  const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datosParaConsultar.territorios_id), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datosParaConsultar.territorios_id), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territorios_id), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    comunidadesGeoJson: comunidadesGeoJson,
    territoriosGeoJson: territoriosGeoJson
  }

};