// src/buscadores/paraAlfanumerica/dinamicas/General.ts
import ComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/dinamicos/comunidadesEnTerritorios';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasDinamicasPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTodosTerritorios';

interface TCETTImp {
  edadMinima: number,
  edadMaxima: number,
  modo: string | string[]
}

export const buscarPorTodasComunidadesEnTodosTerritorios = async ({ edadMinima, edadMaxima, modo }: TCETTImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexoEdad
  ] = await Promise.all([
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.sexoEdad(edadMinima, edadMaxima), modo)
  ]);
  return {
    sexoEdad
  };
};

export default buscarPorTodasComunidadesEnTodosTerritorios;
