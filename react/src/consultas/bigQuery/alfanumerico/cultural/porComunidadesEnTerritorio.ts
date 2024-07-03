// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({comunidadesId}) => `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) + SUM(total_mujeres) AS conteo,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            nombre_lengua;`,
    etnias: ({comunidadesId}) => `
        SELECT
            ETNIA AS etnia,
            SUM(CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            etnia;`,
    clanes: ({comunidadesId}) => `
        SELECT
            COUNT(*) AS conteo,
            clan
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            clan;`
    };

export default funciones;