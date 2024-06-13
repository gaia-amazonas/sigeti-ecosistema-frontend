// src/tipos/datosConsultados.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface GeometryData {
  value: string;
}

interface ComunidadesRow {
  geometry: GeometryData;
  nomb_cnida: string;
}

interface Comunidades {
  rows: ComunidadesRow[];
}

interface FamiliasRow {
  familias: number;
}

interface Familias {
  rows: FamiliasRow[];
}

interface SexoRow {
  SEXO: string;
  f0_: number;
}

interface Sexo {
  rows: SexoRow[];
}

interface SexoEdadRow {
  age_group: string;
  sexo: string;
  count: number;
  age_group_order: number;
}

interface SexoEdad {
  rows: SexoEdadRow[];
}

interface TerritorioRow {
  geometry: string;
  id_ti: string;
  territorio: string;
}

interface Territorio {
  rows: TerritorioRow[];
}

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}

interface DatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexo_edad: SexoEdad | null;
  territorio: Territorio | null;
  comunidades_en_territorio: Comunidades | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
}

export default DatosConsultados;