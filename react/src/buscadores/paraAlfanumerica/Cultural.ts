// src/buscadores/paraAlfanumerica/Cultural.ts
import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasCulturalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorio';
import consultasCulturalesPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios';
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
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.sexoYLengua(datosParaConsultar), modo);
  const etniasEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorio.etniasEnComunidades(datosParaConsultar), modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: etniasEnComunidades
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.sexoYLengua(datosParaConsultar), modo);
  const etniasEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTerritorios.etniasEnComunidades(datosParaConsultar), modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: etniasEnComunidades
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async (modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.sexoYLengua, modo);
  const etniasEnComunidades = await buscarDatos(consultasCulturalesPorTodasComunidadesEnTodosTerritorios.etniasEnComunidades, modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
    etniasEnComunidades: etniasEnComunidades
  };
};
