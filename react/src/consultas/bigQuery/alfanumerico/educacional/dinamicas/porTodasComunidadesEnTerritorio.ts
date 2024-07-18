// src/consultas/bigQuery/alfanumerico/educacional/dinamicas/porTodasComunidadesEnTerritorio.ts

import haceClausulasWhere from "../../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]},
    edades: {edadMinima: number, edadMaxima: number}, educacion: string) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({ territoriosId }, { edadMinima, edadMaxima }, educacion) => `
        SELECT
            comunidadId, escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\` epss
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            epss.comunidadId = rcpt.id_cnida
        WHERE
            educacion = '${educacion}' AND
            edad >= ${edadMinima} AND edad < ${edadMaxima} AND
            ${haceClausulasWhere({territoriosId}, 'rcpt.id_ti')}
        GROUP BY
            comunidadId, escolarizacion;
    `
}

export default funciones;