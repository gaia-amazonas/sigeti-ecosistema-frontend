// src/tipos/cultural/datosConsultados.ts

interface SexosPorLenguasEnComunidadFila {
  lengua: string;
  hombres: number;
  mujeres: number;
  nombreComunidad: string;
}

interface SexosPorLenguaEnComunidades {
  rows: SexosPorLenguasEnComunidadFila[];
}

interface DatosConsultados {
  sexosPorLenguaEnComunidades: SexosPorLenguaEnComunidades | null;
}

export default DatosConsultados;