// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    pueblos: ({comunidadesId}) => `
        SELECT
            id_cnida AS comunidadId,
            pueblo,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_pueblos_en_comunidades\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            pueblo, id_cnida;`,
    lenguas: ({comunidadesId}) => `
        SELECT
            id_cnida as comunidadId,
            lengua AS lengua,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_lenguas_en_comunidades\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            lengua, id_cnida;`,
    etnias: ({comunidadesId}) => `
        SELECT
            id_cnida AS comunidadId,
            etnia,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_etnias_en_comunidades\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            etnia, id_cnida;`,
    clanes: ({comunidadesId}) => `
        SELECT
            id_cnida AS comunidadId,
            clan,
            COUNT(*) AS conteo
        FROM
            \`sigeti.NS_NC.BD_Personas\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            clan, id_cnida;`
    ,
    territorios: ({ territoriosId }) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    comunidadesEnTerritorios: ({ comunidadesId }) => `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nombre,
            ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')};`
    };

export default funciones;