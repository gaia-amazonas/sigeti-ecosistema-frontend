// src/tipos/cultural/datosConsultados.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

interface SexosPorLenguasEnComunidadFila {
  lengua: string;
  hombres: number;
  mujeres: number;
  nombreComunidad: string;
}

interface EntniasEnComunidadFila {
  etnia: string;
  conteo: number;
}

interface ClanesEnComunidadFila {
  clan: string;
  conteo: number;
}

interface SexosPorLenguaEnComunidades {
  rows: SexosPorLenguasEnComunidadFila[];
}

interface EtniasEnComunidades {
  rows: EntniasEnComunidadFila[];
}

interface ClanesEnComunidades {
  rows: ClanesEnComunidadFila[];
}

interface PueblosEnComunidadesFila {
  pueblo: string;
  conteo: number;
}

interface PueblosEnComunidades {
  rows: PueblosEnComunidadesFila[];
}

export interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};
export interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface DatosConsultados {
  lenguas: SexosPorLenguaEnComunidades | null;
  etnias: EtniasEnComunidades | null;
  clanes: ClanesEnComunidades | null;
  pueblos: PueblosEnComunidades | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
}

export default DatosConsultados;