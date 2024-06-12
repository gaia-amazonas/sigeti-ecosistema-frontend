import { buscarDatos } from 'buscadores/datosSQL';
import consultasGeneralesPorTerritorio from 'consultas/bigQuery/alfanumerico/porTerritorios';
import consultasGeneralesTodosGeoTerritorios from 'consultas/bigQuery/alfanumerico/todosGeoTerritorios';
import consultasGeneralesTodasGeoComunidadesPorTerritorio from 'consultas/bigQuery/alfanumerico/todasGeoComunidadesPorTerritorio';
import { buscarTerritorios } from 'buscadores/geoJson';

interface DatosParaConsultar {
  territorios_id: string[];
  comunidades_id: string[];
}

export const buscarDatosPorTerritorioYComunidad = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]) => {

  const sexo = await buscarDatos(consultasGeneralesPorTerritorio.sexo(datosParaConsultar.comunidades_id), modo);
  const familias = await buscarDatos(consultasGeneralesPorTerritorio.familias(datosParaConsultar.comunidades_id), modo);
  const sexo_edad = await buscarDatos(consultasGeneralesPorTerritorio.sexo_edad(datosParaConsultar.comunidades_id), modo);
  const territorio = await buscarDatos(consultasGeneralesPorTerritorio.territorio(datosParaConsultar.comunidades_id), modo);
  const comunidades_en_territorio = await buscarDatos(consultasGeneralesPorTerritorio.comunidades_en_territorio(datosParaConsultar.comunidades_id), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesPorTerritorio.territorio(datosParaConsultar.comunidades_id), modo);
  console.log("SEXO", sexo);
  console.log("Familias", familias);
  console.log("SEXO EDAD", sexo_edad);
  console.log("TERRITORIO", territorio);
  console.log("COMUNIDADES EN TERRITORIO", comunidades_en_territorio);
  console.log("TERRTIRORIOS GEOJSON", territoriosGeoJson);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    territorio: territorio,
    comunidades_en_territorio: comunidades_en_territorio,
    territoriosGeoJson: territoriosGeoJson
  }

};

export const buscarDatosParaTodosTerritoriosYComunidades = async (modo: string | string[]) => {

  const sexo = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo, modo);
  const familias = await buscarDatos(consultasGeneralesTodosGeoTerritorios.familias, modo);
  const sexo_edad = await buscarDatos(consultasGeneralesTodosGeoTerritorios.sexo_edad, modo);
  const territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.territorio, modo);
  const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodosGeoTerritorios.comunidades_en_territorio, modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodosGeoTerritorios.territorio, modo);
  console.log("SEXO", sexo);
  console.log("Familias", familias);
  console.log("SEXO EDAD", sexo_edad);
  console.log("TERRITORIO", territorio);
  console.log("COMUNIDADES EN TERRITORIO", comunidades_en_territorio);
  console.log("TERRTIRORIOS GEOJSON", territoriosGeoJson);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    territorio: territorio,
    comunidades_en_territorio: comunidades_en_territorio,
    territoriosGeoJson: territoriosGeoJson
  }

};

export const buscarDatosPorTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]) => {

  const sexo = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo(datosParaConsultar.territorios_id), modo);
  const familias = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.familias(datosParaConsultar.territorios_id), modo);
  const sexo_edad = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.sexo_edad(datosParaConsultar.territorios_id), modo);
  const territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territorios_id), modo);
  const comunidades_en_territorio = await buscarDatos(consultasGeneralesTodasGeoComunidadesPorTerritorio.comunidades_en_territorio(datosParaConsultar.territorios_id), modo);
  const territoriosGeoJson = await buscarTerritorios(consultasGeneralesTodasGeoComunidadesPorTerritorio.territorio(datosParaConsultar.territorios_id), modo);
  console.log("SEXO", sexo);
  console.log("Familias", familias);
  console.log("SEXO EDAD", sexo_edad);
  console.log("TERRITORIO", territorio);
  console.log("COMUNIDADES EN TERRITORIO", comunidades_en_territorio);
  console.log("TERRTIRORIOS GEOJSON", territoriosGeoJson);
  return {
    sexo: sexo,
    familias: familias,
    sexo_edad: sexo_edad,
    territorio: territorio,
    comunidades_en_territorio: comunidades_en_territorio,
    territoriosGeoJson: territoriosGeoJson
  }

};