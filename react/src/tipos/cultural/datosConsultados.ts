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

interface SexosPorLenguaEnComunidades {
  rows: SexosPorLenguasEnComunidadFila[];
}

interface EtniasEnComunidades {
  rows: EntniasEnComunidadFila[];
}

interface DatosConsultados {
  sexosPorLenguaEnComunidades: SexosPorLenguaEnComunidades | null;
  etniasEnComunidades: EtniasEnComunidades | null;
}

export default DatosConsultados;