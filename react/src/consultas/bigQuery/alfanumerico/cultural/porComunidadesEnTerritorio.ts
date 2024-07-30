// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    pueblos: ({comunidadesId}) => `
        SELECT
            cp.ID_CNIDA AS comunidadId,
            cp.PUEBLO AS pueblo,
            SUM(cp.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Pueblos\` cp
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'cp.ID_CNIDA')}
        GROUP BY
            cp.PUEBLO, cp.ID_CNIDA;`,
    lenguas: ({comunidadesId}) => `
        SELECT
            ID_CNIDA as comunidadId,
            LENGUA_HAB AS lengua,
            SUM(NUM_HAB) AS conteo
        FROM
            \`sigeti.censo_632.Distribución_Lenguas\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            ID_CNIDA, LENGUA_HAB;`,
    etnias: ({comunidadesId}) => `
        SELECT
            id_cnida as comunidadId,
            ETNIA AS etnia,
            SUM(CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            etnia, id_cnida;`,
    clanes: ({comunidadesId}) => `
        SELECT
            id_cnida as comunidadId,
            clan,
            COUNT(*) AS conteo
        FROM
            \`sigeti.censo_632.BD_personas\`
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