// src/buscadores/paraAlfanumerica/Educacional.ts

import { buscarDatos } from 'buscadores/datosSQL';

import ComunidadesEnTerritorioDatosConsultados from 'tipos/educacional/datosConsultados';
import consultasEducacionalesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/educacional/porComunidadesEnTerritorio';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const [escolaridadJoven, escolaridad] = await Promise.all([
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridadJoven(datosParaConsultar), modo),
    buscarDatos(consultasEducacionalesPorComunidadesEnTerritorio.escolaridad(datosParaConsultar), modo),
  ]);
  return {
    escolaridadJoven: escolaridadJoven,
    escolaridad: escolaridad,
  };
};