// src/components/transformadores/stringPostGISAGeoJson.ts
import { Feature, Polygon as GeoJSONPolygon, Point as GeoJSONPoint } from 'geojson';

interface Poligono {
  type: 'Polygon';
  coordinates: number[][][];
}

interface Puntos {
  type: 'Point';
  coordinates: number[];
}

type GeoJSON = Feature<GeoJSONPolygon> | Feature<GeoJSONPoint>;

export const stringPostGISAGeoJSON = (objetoGeometrico: any): GeoJSON => {
  return divideTransformacionPorTipoDato(objetoGeometrico);
};

const divideTransformacionPorTipoDato = (objetoGeometrico: any): GeoJSON => {
  try {
      return detectaObjetosComoString(objetoGeometrico);
  } catch (error) {
      throw new Error('Formato JSON inválido: ' + error);
  }
};

const detectaObjetosComoString = (objetoGeometrico: any): GeoJSON => {
  if (typeof objetoGeometrico.value === 'string') {
      const geometriaValue = objetoGeometrico.value.trim();
      return detectaTipoGeometrico(geometriaValue);
  } else {
      throw new Error(`El tipo de datos de la geometría (${typeof objetoGeometrico.value}) no es string`);
  }
};

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
    .map((ring: any[]) => ring.filter(pair => !isNaN(pair[0]) && !isNaN(pair[1])));

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
