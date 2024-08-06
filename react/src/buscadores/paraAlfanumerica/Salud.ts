import ComunidadesEnTerritoriosDatosConsultados from 'tipos/salud/datosConsultados';
import consultasPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/salud/porComunidadesEnTerritorios';
import consultasPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/salud/porTodasComunidadesEnTerritorios';
import consultasPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/salud/porTodasComunidadesEnTodosTerritorios'

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorios = async (
  datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  territoriosPrivados?: string[]
): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [mujeresEnEdadFertil, chagrasPorPersonaYFamilia, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasPorComunidadesEnTerritorios.mujeresEnEdadFertil(datosParaConsultar, territoriosPrivados), modo),
    buscarDatos(consultasPorComunidadesEnTerritorios.chagrasPorPersonaYFamilia(datosParaConsultar), modo),
    buscarTerritorios(consultasPorComunidadesEnTerritorios.territorios(datosParaConsultar, territoriosPrivados), modo),
    buscarComunidades(consultasPorComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar, territoriosPrivados), modo)
  ]);
  return {
    mujeresEnEdadFertil: mujeresEnEdadFertil,
    chagrasPorPersonaYFamilia: chagrasPorPersonaYFamilia,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (
  datosParaConsultar: DatosParaConsultar,
  modo: string | string[],
  territoriosPrivados?: string[]
): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [mujeresEnEdadFertil, chagrasPorPersonaYFamilia, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasPorTodasComunidadesEnTerritorios.mujeresEnEdadFertil(datosParaConsultar, territoriosPrivados), modo),
    buscarDatos(consultasPorTodasComunidadesEnTerritorios.chagrasPorPersonaYFamilia(datosParaConsultar), modo),
    buscarTerritorios(consultasPorTodasComunidadesEnTerritorios.territorios(datosParaConsultar, territoriosPrivados), modo),
    buscarComunidades(consultasPorTodasComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar, territoriosPrivados), modo)
  ]);
  return {
    mujeresEnEdadFertil: mujeresEnEdadFertil,
    chagrasPorPersonaYFamilia: chagrasPorPersonaYFamilia,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (
  modo: string | string[],
  territoriosPrivados?: string[]
): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [mujeresEnEdadFertil, chagrasPorPersonaYFamilia, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasPorTodasComunidadesEnTodosTerritorios.mujeresEnEdadFertil(territoriosPrivados), modo),
    buscarDatos(consultasPorTodasComunidadesEnTodosTerritorios.chagrasPorPersonaYFamilia(), modo),
    buscarTerritorios(consultasPorTodasComunidadesEnTodosTerritorios.territorios(territoriosPrivados), modo),
    buscarComunidades(consultasPorTodasComunidadesEnTodosTerritorios.comunidadesEnTerritorios(territoriosPrivados), modo)
  ]);
  return {
    mujeresEnEdadFertil: mujeresEnEdadFertil,
    chagrasPorPersonaYFamilia: chagrasPorPersonaYFamilia,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};
