// src/tipos/datosConsultados/comunidadesEnTerritorio.ts
import { FamiliasPorComunidadFila,
    Sexo,
    Familias,
    SexoEdad,
    PoblacionTotalPorComunidadFila,
    FamiliasConElectricidadPorComunidadFila,
    TerritorioGeoJson,
    ComunidadesGeoJson } from './comunidadesEnTerritorio';

interface FamiliasPorComunidadConTerritorioFila extends FamiliasPorComunidadFila {
  territorioNombre: string;
  territorioId: string;
}

interface FamiliasPorComunidadConTerritorio {
    rows: FamiliasPorComunidadConTerritorioFila[];
}

interface PoblacionTotalPorComunidadConTerritorioFila extends PoblacionTotalPorComunidadFila {
    territorioNombre: string;
    territorioId: string;
}

interface PoblacionTotalPorComunidadConTerritorio {
    rows: PoblacionTotalPorComunidadConTerritorioFila[];
}

interface FamiliasConElectricidadPorComunidadConTerritorioFila extends FamiliasConElectricidadPorComunidadFila {
    territorioNombre: string;
    territorioId: string;
}

interface FamiliasConElectricidadPorComunidadConTerritorio {
    rows: FamiliasConElectricidadPorComunidadConTerritorioFila[]
}

export interface ComunidadesEnTerritoriosDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidadConTerritorio | null;
  poblacionPorComunidad: PoblacionTotalPorComunidadConTerritorio | null;
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidadConTerritorio | null;
  comunidadesGeoJson: ComunidadesGeoJson | null;
  territorioGeoJson: TerritorioGeoJson | null;
}

export interface TodasComunidadesEnTerritorioDatosConsultados extends ComunidadesEnTerritoriosDatosConsultados {

};