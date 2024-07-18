// src/consultas/bigQuery/alfanumerico/educacional/dinamicas/porComunidadesEnTerritorio.ts

import haceClausulasWhere from "../../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]},
    edades: {edadMinima: number, edadMaxima: number}, educacion: string) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({ comunidadesId }, { edadMinima, edadMaxima }, educacion) => `
        SELECT
            comunidadId, escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\`
        WHERE
            educacion = ${educacion} AND
            edad >= ${edadMinima} AND edad < ${edadMaxima} AND
            ${haceClausulasWhere({comunidadesId}, 'comunidadId')};
    `
};

export default funciones;