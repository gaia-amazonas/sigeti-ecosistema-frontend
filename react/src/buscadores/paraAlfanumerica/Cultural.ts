// src/buscadores/paraAlfanumerica/Cultural.ts
import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasCulturalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios'
import consultasCulturalesPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [sexosPorLenguaEnComunidades, etniasEnComunidades] = await Promise.all([
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.sexoYLengua(datosParaConsultar), modo),
    buscarDatos(consultasCulturalesPorComunidadesEnTerritorio.etniasEnComunidades(datosParaConsultar), modo)
  ]);

  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: etniasEnComunidades
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.sexo(datosParaConsultar), modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: null
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.sexo(datosParaConsultar), modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: null
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.sexo, modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: null
  };
};
