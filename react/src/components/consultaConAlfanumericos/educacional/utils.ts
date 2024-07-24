// src/components/consultaConAlfanumericos/educacional/utils.ts

import DatosConsultados, { Escolaridad, EscolaridadFila } from 'tipos/educacional/datosConsultados';

export const datosCulturalesInvalidos = (datosEducacionales: DatosConsultados) => {
    return !datosEducacionales.escolaridadPrimariaYSecundaria ||
        !datosEducacionales.comunidadesGeoJson ||
        !datosEducacionales.escolaridad ||
        !datosEducacionales.escolaridadJoven ||
        !datosEducacionales.territoriosGeoJson;
};

export const segmentarPorEdadYSexoParaGraficasPiramidales = (sexoEdadDatos: Escolaridad | null) => {
    if (!sexoEdadDatos) {
        return null;
    }
    return sexoEdadDatos.rows.map((item: EscolaridadFila) => ({
        grupo: item.nivelEducativo,
        [item.sexo]: item.conteo * (item.sexo === 'Hombres' ? -1 : 1)
    }));
};
