// src/utils/geoJsonUtils.ts
import { buscarDatosGeoJson } from 'buscadores/datosSQL';
import { FeatureCollection } from 'geojson';

export const buscarTerritorios = async (consultaTerritorio: string, modo: string | string[]): Promise<FeatureCollection | null> => {
  const featuresMapa = (row: any) => {
    let geometry;
    try {
      geometry = JSON.parse(row.geometry);
    } catch (error) {
      throw new Error(`Error (${error}) parsing the geometry of the row ${JSON.stringify(row)}`);
    }

    return {
      type: 'Feature',
      properties: {
        territorio: row.territorio,
        id_ti: row.id_ti
      },
      geometry: geometry
    };
  };
  const geoJson = await buscarDatosGeoJson(consultaTerritorio, modo, featuresMapa);
  return geoJson;

};
