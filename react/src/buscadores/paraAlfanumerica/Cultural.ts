// src/buscadores/paraAlfanumerica/Cultural.ts
import ComunidadesEnTerritorioDatosConsultados from 'tipos/cultural/datosConsultados';

import { buscarDatos } from 'buscadores/datosSQL';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

export const buscarPorComunidadesEnTerritorio = async (datosParaConsultar: DatosParaConsultar, modo: string | string[]): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  const sexosPorLenguaEnComunidades = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexo(datosParaConsultar), modo);
  return {
    sexosPorLenguaEnComunidades: sexosPorLenguaEnComunidades,
  }
};