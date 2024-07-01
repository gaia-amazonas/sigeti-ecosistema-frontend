// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({territoriosId}) => `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) + SUM(total_mujeres) AS conteo,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            nombre_lengua;`
    ,
    etniasEnComunidades: ({territoriosId}) => `
        SELECT
            ce.ETNIA as etnia,
            SUM(ce.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\` ce
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cp
        ON
            ce.ID_CNIDA = cp.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'cp.id_ti')}
        GROUP BY
            etnia;`
    };

export default funciones;