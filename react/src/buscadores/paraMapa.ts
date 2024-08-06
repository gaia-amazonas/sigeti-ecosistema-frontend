import logger from 'utilidades/logger';

import { buscarDatos } from 'buscadores/datosSQL';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/mapa/paraComunidades';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/mapa/paraTerritorios';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/mapa/paraLineasColindantes';

import { organizaDocumentacionPorFecha } from 'utilidades/organizadores'

import { FeatureLineas, FeatureTerritorios } from 'components/consultaConMapa/tipos'; 

export const traeInformacionComunidad = async (idComunidad: string, modo: string | string[]) => {
  try {
    const [sexos, nombre, territorio, familias, pueblos] = await Promise.all([
      buscarDatos(consultasBigQueryParaComunidades.sexo(idComunidad), modo),
      buscarDatos(consultasBigQueryParaComunidades.nombreComunidad(idComunidad), modo),
      buscarDatos(consultasBigQueryParaComunidades.nombreTerritorio(idComunidad), modo),
      buscarDatos(consultasBigQueryParaComunidades.familias(idComunidad), modo),
      buscarDatos(consultasBigQueryParaComunidades.pueblos(idComunidad), modo)
    ]);
    return { sexos, nombre, territorio, familias, pueblos };
  } catch (error) {
    logger.error('Error buscando información demográfica por comunidad:', error);
    return { sexos: { rows: [] }, nombre: { rows: [] }, territorio: { rows: [] }, familias: { rows: [] }, pueblos: { rows: [] } };
  }
};

export const traeInformacionDocumentalLineaColindante = async (linea: FeatureLineas, modo: string | string[]) => {
  try {
    const gestionDocumental = await buscarDatos(consultasBigQueryParaLineasColindantes.gestionDocumentalLineaColindante(linea.properties.id), modo);
    organizaDocumentacionPorFecha(gestionDocumental);
    return gestionDocumental.rows[0];
  } catch (error) {
    logger.error('Error buscando documentación para línea colindante:', error);
    return null;
  }
};

export const traeInformacionDocumentalTerritorio = async (territorio: FeatureTerritorios, modo: string | string[]) => {
  try {
    const gestionDocumental = await buscarDatos(consultasBigQueryParaTerritorios.gestionDocumentalTerritorio(territorio.properties.id), modo);
    organizaDocumentacionPorFecha(gestionDocumental);
    return gestionDocumental.rows;
  } catch (error) {
    logger.error('Error buscando información documental para el territorio:', error);
    return [];
  }
};

export const traeSexosPorComunidad = async (modo: string | string[]) => {
  try {
    const comunidadesData = await buscarDatos(consultasBigQueryParaComunidades.sexosPorComunidad, modo);
    return comunidadesData;
  } catch (error) {
    logger.error('Error buscando datos por sexo de communidades:', error);
    return { rows: [] };
  }
};

export const traeInfraestructuraEducacionalPorComunidad = async (comunidadesId: string[], modo: string | string[]) => {
  try {
    return await buscarDatos(consultasBigQueryParaComunidades.infraestructura(comunidadesId), modo);
  } catch (error) {
    logger.error('Error buscando infraestructura por comunidad');
    return { rows: []};
  }
}