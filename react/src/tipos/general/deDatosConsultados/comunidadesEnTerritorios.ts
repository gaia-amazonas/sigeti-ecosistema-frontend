// src/tipos/general/deDatosConsultados/comunidadesEnTerritorios.ts
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import { FamiliasPorComunidadFila,
    Sexo,
    Familias,
    SexoEdad,
    PoblacionTotalPorComunidadFila,
    FamiliasConElectricidadPorComunidadFila,
    ComunidadesGeoJson } from './comunidadesEnTerritorio';

export interface TerritoriosGeoJson extends FeatureCollection<Geometry, GeoJsonProperties> {};

interface FamiliasPorComunidadConTerritorioFila extends FamiliasPorComunidadFila {
  territorioNombre: string;
  territorioId: string;
}

export interface FamiliasPorComunidadConTerritorio {
    rows: FamiliasPorComunidadConTerritorioFila[];
}

interface PoblacionTotalPorComunidadConTerritorioFila extends PoblacionTotalPorComunidadFila {
    territorioNombre: string;
    territorioId: string;
}

export interface PoblacionTotalPorComunidadConTerritorio {
    rows: PoblacionTotalPorComunidadConTerritorioFila[];
}

export interface FamiliasConElectricidadPorComunidadConTerritorioFila extends FamiliasConElectricidadPorComunidadFila {
    territorioNombre: string;
    territorioId: string;
}

export interface FamiliasConElectricidadPorComunidadConTerritorio {
    rows: FamiliasConElectricidadPorComunidadConTerritorioFila[]
}

interface ComunidadesEnTerritoriosDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidadConTerritorio | null;
  poblacionPorComunidad: PoblacionTotalPorComunidadConTerritorio | null;
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidadConTerritorio | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territoriosGeoJson: TerritoriosGeoJson | null;
  comunidadesEnTerritorios: { rows: { territorioId: string, comunidadesId: string[] }[] } | null;
}

export default ComunidadesEnTerritoriosDatosConsultados;