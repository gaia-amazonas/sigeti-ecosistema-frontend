import ComunidadesEnTerritoriosDatosConsultados from 'tipos/salud/datosConsultados';
import consultasSaludPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/salud/porComunidadesEnTerritorios';

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
  const [mujeresEnEdadFertil, territoriosGeoJson, comunidadesGeoJson] = await Promise.all([
    buscarDatos(consultasSaludPorComunidadesEnTerritorios.mujeresEnEdadFertil(datosParaConsultar, territoriosPrivados), modo),
    buscarTerritorios(consultasSaludPorComunidadesEnTerritorios.territorios(datosParaConsultar, territoriosPrivados), modo),
    buscarComunidades(consultasSaludPorComunidadesEnTerritorios.comunidadesEnTerritorios(datosParaConsultar, territoriosPrivados), modo)
  ]);
  return {
    mujeresEnEdadFertil: mujeresEnEdadFertil,
    territoriosGeoJson: territoriosGeoJson,
    comunidadesGeoJson: comunidadesGeoJson
  };
};
