// src/consultas/bigQuery/alfanumerico/educacional/dinamicas/porTodasComunidadesEnTerritorio.ts

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]},
    edades: {edadMinima: number, edadMaxima: number}, educacion: string) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({}, { edadMinima, edadMaxima }, educacion) => `
        SELECT
            comunidadId, escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\`
        WHERE
            educacion = '${educacion}' AND
            edad >= ${edadMinima} AND edad < ${edadMaxima}
        GROUP BY
            comunidadId, escolarizacion;
    `
}

export default funciones;