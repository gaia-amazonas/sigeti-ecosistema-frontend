import logger from 'utilidades/logger';

import { buscarDatos } from 'buscadores/datosSQL';
import consultasBigQueryParaComunidades from 'consultas/bigQuery/paraComunidades';
import consultasBigQueryParaTerritorios from 'consultas/bigQuery/paraTerritorios';
import consultasBigQueryParaLineasColindantes from 'consultas/bigQuery/paraLineasColindantes';

import { organizaDocumentacionPorFecha } from 'utilidades/organizadores'

import { FeatureLineas, FeatureTerritorios } from 'components/mapas/tipos'; 

export const traeInformacionComunidad = async (idComunidad: string, modo: string | string[]) => {
  try {
    const sexos = await buscarDatos(consultasBigQueryParaComunidades.sexo(idComunidad), modo);
    const nombre = await buscarDatos(consultasBigQueryParaComunidades.nombreComunidad(idComunidad), modo);
    const territorio = await buscarDatos(consultasBigQueryParaComunidades.nombreTerritorio(idComunidad), modo);
    const familias = await buscarDatos(consultasBigQueryParaComunidades.familias(idComunidad), modo);
    const pueblos = await buscarDatos(consultasBigQueryParaComunidades.pueblos(idComunidad), modo);
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
