// src/tipos/datosConsultados/dinamicos/comunidadesEnTerritorios.ts
import { Familias, Sexo, SexoEdad } from '../comunidadesEnTerritorio';
import { PoblacionTotalPorComunidadConTerritorio, FamiliasConElectricidadPorComunidadConTerritorio, FamiliasPorComunidadConTerritorio } from '../comunidadesEnTerritorios';

interface ComunidadesEnTerritoriosDatosConsultados {
  sexo: Sexo | null;
  familias: Familias | null;
  sexoEdad: SexoEdad | null;
  familiasPorComunidad: FamiliasPorComunidadConTerritorio | null;
  poblacionPorComunidad: PoblacionTotalPorComunidadConTerritorio | null;
  familiasConElectricidadPorComunidad: FamiliasConElectricidadPorComunidadConTerritorio | null;
}

export default ComunidadesEnTerritoriosDatosConsultados;