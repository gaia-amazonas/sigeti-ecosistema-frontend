// src/buscadores/paraAlfanumerica/Cultural.ts

import { buscarDatos } from 'buscadores/datosSQL';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';
import consultasCulturalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios';
import consultasCulturalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [sexosPorLengua, etnias, clanes] = await Promise.all([
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.sexoYLengua(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.etnias(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.clanes(datosParaConsultar), modo)
  ]);
  return {
    sexosPorLengua: sexosPorLengua,
    etnias: etnias,
    clanes: clanes
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLengua = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.sexoYLengua(datosParaConsultar), modo);
  const etnias = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.etnias(datosParaConsultar), modo);
  const clanes = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.clanes(datosParaConsultar), modo);
  return {
    sexosPorLengua: sexosPorLengua,
    etnias: etnias,
    clanes: clanes
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLengua = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.sexoYLengua(datosParaConsultar), modo);
  const etnias = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.etnias(datosParaConsultar), modo);
  const clanes = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.clanes(datosParaConsultar), modo);
  return {
    sexosPorLengua: sexosPorLengua,
    etnias: etnias,
    clanes: clanes
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLengua = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.sexoYLengua, modo);
  const etnias = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.etnias, modo);
  const clanes = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.clanes, modo);
  return {
    sexosPorLengua: sexosPorLengua,
    etnias: etnias,
    clanes: clanes
  };
};
