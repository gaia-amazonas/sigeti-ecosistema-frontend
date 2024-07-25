// src/consultas/bigQuery/alfanumerico/educacional/dinamicas/porComunidadesEnTerritorio.ts

import haceClausulasWhere from "../../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]},
    edades: {edadMinima: number, edadMaxima: number}, educacion: string, territoriosPrivados: string[]) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({ comunidadesId }, { edadMinima, edadMaxima }, educacion, territoriosPrivados) => `
        SELECT
            comunidadId, escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\` epss
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            epss.comunidadId = rcpt.id_cnida
        WHERE
            (${haceClausulasWhere({territoriosPrivados}, 'rcpt.id_ti')}) AND
            epss.educacion = '${educacion}' AND
            epss.edad >= ${edadMinima} AND epss.edad < ${edadMaxima} AND
            ${haceClausulasWhere({comunidadesId}, 'epss.comunidadId')}
        GROUP BY
            epss.comunidadId, epss.escolarizacion;
    `
};

export default funciones;