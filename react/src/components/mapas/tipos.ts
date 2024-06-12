import { Geometry, Feature } from 'geojson';
import { Path, PathOptions } from 'leaflet';

export interface GeometriasConVariables extends Feature<Geometry> {
  properties: {
    nombre: string;
    id: string;
    [key: string]: string | number;
  };
}

export interface MapaImp {
  modo: string | string[];
}

export interface FilaLineas {
  OBJECTID: string;
  COL_ENTRE: string;
  geometry: string;
}

export interface FilaTerritorios {
  NOMBRE_TI: string;
  ID_TI: string;
  ABREV_TI: string;
  geometry: string;
}

export interface FilaComunidades {
  nomb_cnida: string;
  id_cnida: string;
  geometry: string;
}

export interface FeatureLineas {
  type: 'Feature';
  properties: {
    id: string;
    col_entre: string;
    colorOriginal?: string;
  };
  geometry: string;
}

export interface FeatureTerritorios extends Feature<Geometry, any> {
  type: 'Feature';
  properties: {
    nombre: string;
    id: string;
    abreviacion: string;
  };
  geometry: Geometry;
}

export interface FeatureComunidades {
  type: 'Feature';
  properties: {
    nombre: string;
    id: string;
  };
  geometry: string;
}

export interface Fecha {
  value: string;
}

export interface DocumentosPorTerritorio {
  DES_DOC: string;
  FECHA_FIN: Fecha;
  FECHA_INICIO: Fecha;
  LINK_DOC: string;
  LUGAR: string;
  TIPO_DOC: string;
}

export interface LineaSeleccionada {
  setStyle: (arg0: { color: string; weight: number; opacity: number; zIndex: number; }) => void;
  feature: { properties: { colorOriginal: string; }};
}

export type PathZIndexOptions = PathOptions & { zIndex?: number };

export interface PathZIndex extends Path {
  setStyle(style: PathZIndexOptions): this;
}

export interface InformacionLineaColindante {
  ACTA_COL: string;
  ACUERDO: string;
  COL_ENTRE: string;
  DEFINICION: string;
  DES_DOC: string;
  ESCENARIO: string;
  FECHA_INICIO: Fecha;
  LINK_DOC: string;
  LUGAR: string;
  NOM_ESCENARIO: string;
  PV_1: string;
  PV_2: string;
  TIPO_DOC: string;
}

export interface PuebloComunidad {
  PUEBLO: string;
}

export interface SexoComunidad {
  SEXO: string;
  f0_: number;
}

export interface GestionDocumental {
  rows: FilaGestionDocumental[];
}

export interface FilaGestionDocumental {
  LUGAR: string;
  TIPO_DOC: string;
  ESCENARIO: string;
  FECHA_INICIO: { value: string };
  COL_ENTRE?: string;
  ACUERDO?: string;
  ACTA_COL?: string;
  DEFINICION?: string;
  DES_DOC?: string;
  LINK_DOC?: string;
  NOM_ESCENARIO?: string;
  PV_1?: string;
  PV_2?: string;
}
