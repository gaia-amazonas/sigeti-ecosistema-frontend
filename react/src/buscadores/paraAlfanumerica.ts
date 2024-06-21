// src/buscadores/paraAlfanumerica.ts
import { ComunidadesEnTerritorioDatosConsultados, TodasComunidadesEnTerritorioDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorio';
import { ComunidadesEnTerritoriosDatosConsultados } from 'tipos/datosConsultados/comunidadesEnTerritorios';

import { buscarDatos } from 'buscadores/datosSQL';
import { buscarComunidades, buscarTerritorios } from 'buscadores/geoJson';
import consultasGeneralesPorComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/porComunidadesEnTerritorio';
import consultasGeneralesPorTodasComunidadesEnTerritorio from 'consultas/bigQuery/alfanumerico/porTodasComunidadesEnTerritorio';
import consultasGeneralesPorComunidadesEnTerritorios from 'consultas/bigQuery/alfanumerico/porComunidadesEnTerritorios';

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

interface BuscarDatosPorComunidadesEnTerritorioImp {
  datosParaConsultar: DatosParaConsultar;
  modo: string | string[];
}


export const buscarPorComunidadesEnTerritorio = async ({datosParaConsultar, modo}: BuscarDatosPorComunidadesEnTerritorioImp): Promise<ComunidadesEnTerritorioDatosConsultados> => {
  
  const sexo = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexo(datosParaConsultar.comunidadesId), modo);
  const familias = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familias(datosParaConsultar.comunidadesId), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.sexoEdad(datosParaConsultar.comunidadesId), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar.comunidadesId), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar.comunidadesId), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar.comunidadesId), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar.comunidadesId), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorio.territorio(datosParaConsultar.comunidadesId), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesGeoJson: comunidadesGeoJson,
    territorioGeoJson: territorioGeoJson
  }

};

export const buscarPorTodasComunidadesTerritorio = async ({datosParaConsultar, modo}: BuscarDatosPorComunidadesEnTerritorioImp): Promise<TodasComunidadesEnTerritorioDatosConsultados> => {
  
  const sexo = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexo(datosParaConsultar.territoriosId), modo);
  const familias = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familias(datosParaConsultar.territoriosId), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.sexoEdad(datosParaConsultar.territoriosId), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasPorComunidad(datosParaConsultar.territoriosId), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.poblacionPorComunidad(datosParaConsultar.territoriosId), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorTodasComunidadesEnTerritorio.familiasConElectricidadPorComunidad(datosParaConsultar.territoriosId), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorTodasComunidadesEnTerritorio.comunidadesEnTerritorio(datosParaConsultar.territoriosId), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorTodasComunidadesEnTerritorio.territorio(datosParaConsultar.territoriosId), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesGeoJson: comunidadesGeoJson,
    territorioGeoJson: territorioGeoJson
  }

};

export const buscarPorComunidadesEnTerritorios = async ({datosParaConsultar, modo}: BuscarDatosPorComunidadesEnTerritorioImp): Promise<ComunidadesEnTerritorioDatosConsultados> => {

  const sexo = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexo(datosParaConsultar.comunidadesId), modo);
  const familias = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familias(datosParaConsultar.comunidadesId), modo);
  const sexoEdad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.sexoEdad(datosParaConsultar.comunidadesId), modo);
  const familiasPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasPorComunidad(datosParaConsultar.comunidadesId), modo);
  const poblacionPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.poblacionPorComunidad(datosParaConsultar.comunidadesId), modo);
  const familiasConElectricidadPorComunidad = await buscarDatos(consultasGeneralesPorComunidadesEnTerritorios.familiasConElectricidadPorComunidad(datosParaConsultar.comunidadesId), modo);
  const comunidadesGeoJson = await buscarComunidades(consultasGeneralesPorComunidadesEnTerritorios.comunidadesEnTerritorio(datosParaConsultar.comunidadesId), modo);
  const territorioGeoJson = await buscarTerritorios(consultasGeneralesPorComunidadesEnTerritorios.territorio(datosParaConsultar.comunidadesId), modo);
  return {
    sexo: sexo,
    familias: familias,
    sexoEdad: sexoEdad,
    familiasPorComunidad: familiasPorComunidad,
    poblacionPorComunidad: poblacionPorComunidad,
    familiasConElectricidadPorComunidad: familiasConElectricidadPorComunidad,
    comunidadesGeoJson: comunidadesGeoJson,
    territorioGeoJson: territorioGeoJson
  }

}


  // buscarPorComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTerritorios,
  // buscarPorTodasComunidadesEnTodosTerritorios