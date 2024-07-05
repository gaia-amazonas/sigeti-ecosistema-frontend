// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({comunidadesId}) => `
        SELECT
            LENGUA_HAB AS lengua,
            SUM(NUM_HAB) AS conteo
        FROM
            \`sigeti.censo_632.Distribución_Lenguas\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            LENGUA_HAB;`,
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