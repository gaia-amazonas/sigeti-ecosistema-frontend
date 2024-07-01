// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorios.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({territoriosId}) => `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) AS hombres, 
            SUM(total_mujeres) AS mujeres,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            nombre_lengua;`
    };

export default funciones;