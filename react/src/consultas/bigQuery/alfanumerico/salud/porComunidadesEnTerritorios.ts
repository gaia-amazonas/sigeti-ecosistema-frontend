// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorios.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    mujeresEnEdadFertil: ({comunidadesId}) => `
        SELECT
            id_cnida AS comunidadId,
            id_ti AS territorioId,
            total_mujeres AS totalMujeres,
            mujeres_en_edad_fertil AS mujeresEnEdadFertil,
            proporcion_mujeres_en_edad_fertil as proporcionMujeresEnEdadFertil
        FROM
            \`sigeti.censo_632.mujeres_edad_fertil\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')};`
    ,
    territorios: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geometry) AS geometry,
            id_ti AS id,
            territorio AS nombre
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')};`
    ,
    comunidadesEnTerritorios: ({comunidadesId}) => `
        SELECT
            ST_AsGeoJSON(geometry) AS geometry,
            id_cnida AS id,
            nomb_cnida AS nombre
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')};`
    };

export default funciones;