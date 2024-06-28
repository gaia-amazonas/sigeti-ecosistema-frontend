// src/tipos/datosConsultados.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface FamiliasFila {
  familias: number;
}

interface FamiliasPorComunidadFila extends FamiliasFila {
  comunidadId: string;
  comunidadNombre: string;
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
  comunidadId: string;
  comunidadNombre: string;
}

interface ComunidadesPorTerritorio {
  territorioId: string;
  territorioNombre: string;
  comunidadesId: string[];
  comunidadesNombre: string[];
}

interface Sexo {
  rows: SexoFila[];
}

interface SexosPorComunidad {
  rows: SexoPorComunidadFila[];
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

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {}

interface TodasComunidadesEnTodosTerritorioDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidad | null;
  sexoEdadPorComunidad: SexosPorComunidad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
  comunidadesPorTerritorio: ComunidadesPorTerritorio | null;
}

export default TodasComunidadesEnTodosTerritorioDatosConsultados;