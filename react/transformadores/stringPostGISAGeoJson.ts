import { Feature, FeatureCollection, Polygon as GeoJSONPolygon, Point as GeoJSONPoint, MultiPolygon as GeoJSONMultiPolygon } from 'geojson';

type GeoJSON = Feature<GeoJSONPolygon> | Feature<GeoJSONPoint> | Feature<GeoJSONMultiPolygon>;

export const stringPostGISAGeoJson = (objetoGeometrico: any): GeoJSON => {
  
  if ('geometry' in objetoGeometrico) {
    return stringPostGISUnicoAGeoJson(objetoGeometrico);
  } else {
    return stringPostGISMultipleAGeoJson(objetoGeometrico);
  }

};

const stringPostGISUnicoAGeoJson = (objetoGeometrico: any): GeoJSON => {

  if (typeof objetoGeometrico.geometry.value === 'string') {
    const geometriaValue = objetoGeometrico.geometry.value.trim();
    return detectaTipoGeometrico(geometriaValue);
  } else {
    throw new Error(`El tipo de datos de la geometría (${typeof objetoGeometrico.geometry.value}) no es string`);
  }

}

const stringPostGISMultipleAGeoJson = (objetoGeometrico: any): GeoJSON => {

  if (typeof objetoGeometrico.value === 'string') {
    const geometriaValue = objetoGeometrico.value.trim();
    return detectaTipoGeometrico(geometriaValue);
  } else {
    throw new Error(`El tipo de datos de la geometría (${typeof objetoGeometrico.value}) no es string`);
  }

}

const detectaTipoGeometrico = (geometriaValue: string): GeoJSON => {
  if (geometriaValue.startsWith('POLYGON')) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: transformaPoligonosStringPostGISAGeoJson(geometriaValue)
      },
      properties: {}
    };
  } else if (geometriaValue.startsWith('MULTIPOLYGON')) {
    return {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: transformaMultiPoligonosStringPostGISAGeoJson(geometriaValue)
      },
      properties: {}
    };
  } else if (geometriaValue.startsWith('POINT')) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: transformaPuntosStringPostGISAGeoJson(geometriaValue)
      },
      properties: {}
    };
  } else {
    throw new Error(`Formato de geometría (${geometriaValue.substring(0, 20)}) inválido`);
  }
};

const transformaPoligonosStringPostGISAGeoJson = (geometriaValue: string): number[][][] => {
  const coordenadas = geometriaValue
    .replace('POLYGON((', '')
    .replace(/\)\)$/, '')
    .split('),(')
    .map((ring: string) => ring.split(',').map(coord => coord.trim().split(' ').map(Number)))
    .map((ring: number[][]) => ring.filter(pair => !isNaN(pair[0]) && !isNaN(pair[1])));

  return coordenadas;
};

const transformaMultiPoligonosStringPostGISAGeoJson = (geometriaValue: string): number[][][][] => {
  const coordenadas = geometriaValue
    .replace('MULTIPOLYGON(((', '')
    .replace(/\)\)\)$/, '')
    .split(')),((')
    .map((polygon: string) => polygon.split('),(')
      .map((ring: string) => ring.split(',').map(coord => coord.trim().split(' ').map(Number)))
      .map((ring: number[][]) => ring.filter(pair => !isNaN(pair[0]) && !isNaN(pair[1])))
    );

  return coordenadas;
};

const transformaPuntosStringPostGISAGeoJson = (geometriaValue: string): number[] => {
  const coordenadas = geometriaValue
    .replace('POINT(', '')
    .replace(/\)$/, '')
    .split(' ')
    .map(Number);

  if (!isNaN(coordenadas[0]) && !isNaN(coordenadas[1])) {
    return coordenadas;
  } else {
    throw new Error('Formato de punto inválido');
  }
};
