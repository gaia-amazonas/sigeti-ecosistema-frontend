// src/tipos/datosConsultados.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface FamiliasFila {
  familias: number;
}

interface FamiliasPorComunidadFila extends FamiliasFila {
  comunidad: string;
}

interface Familias {
  filas: FamiliasFila[];
}

interface FamiliasPorComunidad {
  filas: FamiliasPorComunidadFila[];
}

interface SexoFila {
  sexo: string;
  cantidad: number;
}

interface SexoPorComunidadFila extends SexoFila {
  comunidad: string;
}

interface Sexo {
  filas: SexoFila[];
}

interface SexosPorComunidad {
  filas: SexoPorComunidadFila[];
}

interface SexoEdadFila {
  grupoPorEdad: string;
  sexo: string;
  contador: number;
  ordenGrupoPorEdad: number;
}

interface SexoEdad {
  rows: SexoEdadFila[];
}

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface DatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidad | null;
  sexoEdadPorComunidad: SexosPorComunidad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
}

export default DatosConsultados;