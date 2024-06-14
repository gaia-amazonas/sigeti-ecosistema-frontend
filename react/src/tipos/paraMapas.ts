import { Geometry, Feature } from 'geojson';

export interface GeometriasConVariables extends Feature<Geometry> {
  properties: {
    nombre: string;
    id: string;
    [key: string]: string | number;
  };
}

export interface FeatureComunidades {
  type: 'Feature';
  properties: {
    nombre: string;
    id: string;
  };
  geometry: string;
}

export interface FilaComunidades {
  nomb_cnida: string;
  id_cnida: string;
  geometry: string;
}