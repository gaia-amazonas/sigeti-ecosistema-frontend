// src/tipos/educacional/datosConsultados.ts

import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export interface EscolaridadPrimariaYSecundariaFila {
  comunidadId: string;
  conteo: number;
  escolarizacion: string;
  educacion: string;
}

export interface EscolaridadPrimariaYSecundaria {
  rows: EscolaridadPrimariaYSecundariaFila[]
}

export interface EscolaridadFila {
  sexo: string;
  nivelEducativo: string;
  conteo: number;
}

export interface Escolaridad {
  rows: EscolaridadFila[];
}

interface InfraestructuraFila {
  tipo: string;
  conteo: number;
}

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface DatosConsultados {
  escolaridadPrimariaYSecundaria: EscolaridadPrimariaYSecundaria | null;
  escolaridadJoven: Escolaridad | null;
  escolaridad: Escolaridad | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
}

export default DatosConsultados;