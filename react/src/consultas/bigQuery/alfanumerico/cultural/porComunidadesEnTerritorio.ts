// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexo: ({comunidadesId}) => `
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
            nombre_lengua;`
    };

export default funciones;