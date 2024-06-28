// src/tipos/datosConsultados/comunidadesEnTerritorio.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface FamiliasFila {
  familias: number;
}

export interface Familias {
  rows: FamiliasFila[];
}

export interface FamiliasPorComunidadFila extends FamiliasFila {
  comunidadNombre: string;
  comunidadId: string;
}

export interface FamiliasPorComunidad {
  rows: FamiliasPorComunidadFila[];
}

export interface FamiliasConElectricidadPorComunidadFila extends FamiliasFila {
  comunidadNombre: string;
  comunidadId: string;
}

export interface FamiliasConElectricidadPorComunidad {
  rows: FamiliasConElectricidadPorComunidadFila[];
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
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territorioGeoJson: TerritorioGeoJson | null;
}

export default ComunidadesEnTerritorioDatosConsultados;