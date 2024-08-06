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

interface ChagrasPorPersonaYFamiliaFila {
  comunidadId: string;
  territorioId: string;
  chagrasPorPersona: number;
  chagrasPorFamilia: number;
}

interface ChagrasPorPersonaYFamilia {
  rows: ChagrasPorPersonaYFamiliaFila[];
}

interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};
interface ComunidadesGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface DatosConsultados {
  mujeresEnEdadFertil: MujeresEnEdadFertil | null;
  chagrasPorPersonaYFamilia: ChagrasPorPersonaYFamilia | null;
  comunidadesGeoJson: ComunidadesGeoJson;
  territoriosGeoJson: TerritoriosGeoJson;
}

export default DatosConsultados;