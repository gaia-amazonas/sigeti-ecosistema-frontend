// src/tipos/salud/datosConsultados.ts

import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export interface MujeresEnEdadFertilFila {
  comunidadId: string;
  territorioId: string;
  totalMujeres: number;
  mujeresTotal: number;
  mujeresEnEdadFertil: number;
  proporcionMujeresEnEdadFertil: number;
}

export interface MujeresEnEdadFertil {
  rows: MujeresEnEdadFertilFila[];
}

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface DatosConsultados {
  mujeresEnEdadFertil: MujeresEnEdadFertil | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
}

export default DatosConsultados;