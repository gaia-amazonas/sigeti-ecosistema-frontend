// src/tipos/cultural/datosConsultados.ts

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

interface DatosConsultados {
  sexosPorLengua: SexosPorLenguaEnComunidades | null;
  etnias: EtniasEnComunidades | null;
  clanes: ClanesEnComunidades | null;
}

export default DatosConsultados;