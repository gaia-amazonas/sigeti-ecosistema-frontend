// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({comunidadesId}) => `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) AS hombres, 
            SUM(total_mujeres) AS mujeres,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            nombre_lengua;`,
    etniasEnComunidades: ({comunidadesId}) => `
        SELECT
            ETNIA as etnia,
            SUM(CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            etnia;`
    };

export default funciones;


// const sexoYLengua: (comunidadesId: string[] ) => `
//     SELECT
//         nombre_lengua AS lengua,
//         SUM(total_hombres) AS hombres, 
//         SUM(total_mujeres) AS mujeres,
//         ANY_VALUE(comunidad) AS nombreComunidad
//     FROM
//         \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
//     WHERE
//         ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
//     GROUP BY
//         nombre_lengua;`;

// const etnias: ({comunidadesId}) => `
//         SELECT
//             ETNIA as etnia,
//             SUM(CONTEO) AS conteo
//         FROM
//             \`sigeti.censo_632.Conteo_Etnias\`
//         WHERE
//             ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
//         GROUP BY
//             etnia;`