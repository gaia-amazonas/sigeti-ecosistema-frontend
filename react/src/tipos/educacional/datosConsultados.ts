// src/tipos/educacional/datosConsultados.ts

export interface EscolaridadFila {
  comunidadId: string;
  sexo: string;
  nivelEducativo: string;
  conteo: number;
}

export interface Escolaridad {
  rows: EscolaridadFila[];
}

interface DatosConsultados {
  escolaridadJoven: Escolaridad | null;
  escolaridad: Escolaridad | null;
}

export default DatosConsultados;