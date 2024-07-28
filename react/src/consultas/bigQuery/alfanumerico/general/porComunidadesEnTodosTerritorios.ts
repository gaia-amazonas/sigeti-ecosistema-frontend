// src/consultas/bigQuery/alfanumerico/general/porComunidadesEnTodosTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    territorios: ({comunidadesId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\` g
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            g.ID_TI = rcpt.id_ti
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'g.ID_CNIDA')};`
    };

export default funciones;