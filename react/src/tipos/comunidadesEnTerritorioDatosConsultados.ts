// src/tipos/datosConsultados.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface FamiliasFila {
  familias: number;
}

interface FamiliasPorComunidadFila extends FamiliasFila {
  comunidad: string;
}

interface Familias {
  rows: FamiliasFila[];
}

interface FamiliasPorComunidad {
  rows: FamiliasPorComunidadFila[];
}

interface SexoFila {
  sexo: string;
  cantidad: number;
}

interface SexoPorComunidadFila extends SexoFila {
  comunidad: string;
}

export interface Sexo {
  rows: SexoFila[];
}

interface SexosPorComunidad {
  rows: SexoPorComunidadFila[];
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

interface TerritorioGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}

interface ComunidadesEnTerritorioDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidad | null;
  sexoEdadPorComunidad: SexosPorComunidad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territorioGeoJson: TerritorioGeoJson | null;
}

export default ComunidadesEnTerritorioDatosConsultados;