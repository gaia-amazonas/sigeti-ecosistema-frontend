// src/consultas/bigQuery/alfanumerico/cultural/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    pueblosPorTerritorio: ({territoriosId}) => `
        SELECT
            cpt.id_ti AS territorioId,
            cp.PUEBLO AS pueblo,
            SUM(cp.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Pueblos\` cp
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cpt
        ON
            cpt.id_cnida = cp.ID_CNIDA
        WHERE
            ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
        GROUP BY
            cp.PUEBLO, cpt.id_ti;`,
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
            clan, id_cnida;`,
    territorios: ({ territoriosId }) => `
        SELECT DISTINCT
        ST_AsGeoJSON(geometry) AS geometry,
        id_ti AS id,
        territorio AS nombre
        FROM
        \`sigeti.unidades_de_analisis.territorios_censo632\`
        WHERE
        ${haceClausulasWhere({ territoriosId }, 'id_ti')};`,
    comunidadesEnTerritorios: ({ comunidadesId }) => `
        SELECT
            ST_AsGeoJSON(geometry) AS geometry,
            id_cnida AS id,
            nomb_cnida AS nombre
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\`
        WHERE
            ${haceClausulasWhere({ comunidadesId }, 'id_cnida')};`
    };

export default funciones;