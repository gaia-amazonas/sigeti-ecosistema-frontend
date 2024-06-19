// src/tipos/datosConsultados/comunidadesEnTerritorio.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface FamiliasFila {
  familias: number;
}

interface FamiliasPorComunidadFila extends FamiliasFila {
  comunidadNombre: string;
}

interface Familias {
  rows: FamiliasFila[];
}

export interface FamiliasPorComunidad {
  rows: FamiliasPorComunidadFila[];
}

interface SexoFila {
  sexo: string;
  cantidad: number;
}

export interface Sexo {
  rows: SexoFila[];
}

export interface SexoEdadFila {
  grupoPorEdad: string;
  sexo: string;
  contador: number;
  ordenGrupoPorEdad: number;
}

export interface SexoEdad {
  rows: SexoEdadFila[];
}

export type DatosPiramidalesItem = {
    grupoPorEdad: string;
    Hombre?: number;
    Mujer?: number;
};

export interface PoblacionTotalPorComunidadFila {
  comunidadId: string;
  comunidadNombre: string;
  poblacionTotal: number;
}

export interface PoblacionTotalPorComunidad {
  rows: PoblacionTotalPorComunidadFila[];
}

export interface TerritorioGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}
export interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}

interface ComunidadesEnTerritorioDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidad | null;
  poblacionPorComunidad: PoblacionTotalPorComunidad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territorioGeoJson: TerritorioGeoJson | null;
}

export default ComunidadesEnTerritorioDatosConsultados;