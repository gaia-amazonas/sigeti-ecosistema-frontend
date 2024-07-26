// src/buscadores/paraAlfanumerica/dinamicas/General.ts
import ComunidadesEnTerritoriosDatosConsultados from 'tipos/general/deDatosConsultados/dinamicos/comunidadesEnTerritorios';
import { buscarDatos } from 'buscadores/datosSQL';
import consultasDinamicasPorTodasComunidadesEnTodosTerritorios from 'consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTodosTerritorios';
import consultasDinamicasPorTodasComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTerritorios';
import consultasDinamicasPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTerritorio';
import consultasDinamicasPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/general/dinamicas/porComunidadesEnTerritorios';


interface DatosParaConsultar {
  territoriosId: string[],
  comunidadesId: string[],
}

interface TCETImp {
  datosParaConsulta: DatosParaConsultar;
  edadMinima: number,
  edadMaxima: number,
  modo: string | string[]
}

interface PTCETTImp {
  edadMinima: number,
  edadMaxima: number,
  modo: string | string[]
}

export const buscarPorComunidadesEnTerritorio = async ({ datosParaConsulta, edadMinima, edadMaxima, modo }: TCETImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  ] = await Promise.all([
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.sexo(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familias(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.sexoEdad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo)
  ]);
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!",
    consultasDinamicasPorComunidadesEnTerritorios.sexo(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familias(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.sexoEdad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }));
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  };
};

export const buscarPorComunidadesEnTerritorios = async ({ datosParaConsulta, edadMinima, edadMaxima, modo }: TCETImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  ] = await Promise.all([
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.sexo(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familias(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.sexoEdad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo)
  ]);
  console.log("$$$$$$$$$$$$$$$$$$$$$$",
    consultasDinamicasPorComunidadesEnTerritorios.sexo(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familias(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.sexoEdad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }),
    consultasDinamicasPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }));
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  };
};

export const buscarPorTodasComunidadesEnTerritorio = async ({ datosParaConsulta, edadMinima, edadMaxima, modo }: TCETImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  ] = await Promise.all([
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.sexo(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.familias(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.sexoEdad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.familiasPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsulta, { edadMinima, edadMaxima }), modo)
  ]);
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  };
};

export const buscarPorTodasComunidadesEnTerritorios = async ({datosParaConsulta, edadMinima, edadMaxima, modo }: TCETImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  ] = await Promise.all([
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.sexo(datosParaConsulta, {edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.familias(datosParaConsulta, {edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.sexoEdad(datosParaConsulta, {edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.familiasPorComunidad(datosParaConsulta, {edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsulta, {edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsulta, {edadMinima, edadMaxima}), modo)
  ]);
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  };
};

export const buscarPorTodasComunidadesEnTodosTerritorios = async ({ edadMinima, edadMaxima, modo }: PTCETTImp): Promise<ComunidadesEnTerritoriosDatosConsultados> => {
  const [sexo, familias, sexoEdad, familiasPorComunidad, poblacionPorComunidad, familiasConElectricidadPorComunidad] = await Promise.all([
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.sexo({edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.familias({edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.sexoEdad({edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.familiasPorComunidad({edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.poblacionPorComunidad({edadMinima, edadMaxima}), modo),
    buscarDatos(consultasDinamicasPorTodasComunidadesEnTodosTerritorios.familiasConElectricidadPorComunidad({edadMinima, edadMaxima}), modo)
  ]);
  return {
    sexo,
    familias,
    sexoEdad,
    familiasPorComunidad,
    poblacionPorComunidad,
    familiasConElectricidadPorComunidad
  };
};