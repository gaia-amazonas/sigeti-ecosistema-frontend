// src/consultas/bigQuery/alfanumerico/general/porComunidadesEnTodosTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    territorios: ({comunidadesId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(t.geometry) AS geometry,
            t.id_ti AS id,
            t.territorio AS nombre
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\` t
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` c
        ON
            t.id_ti = c.id_ti
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'c.id_cnida')}`
    };


export default funciones;