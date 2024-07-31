// src/consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTerritorio.ts

import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]}, territoriosPrivados?: string[]) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({ territoriosId }, territoriosPrivados) => `
        SELECT
            comunidadId, escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\` epss
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            epss.comunidadId = rcpt.id_cnida
        WHERE
            (${haceClausulasWhere({territoriosPrivados}, 'rcpt.id_ti')}) AND
            educacion = 'Primaria' AND
            edad >= 5 AND edad < 14 AND
            ${haceClausulasWhere({territoriosId}, 'rcpt.id_ti')}
        GROUP BY
            comunidadId, escolarizacion;
    `,
    escolaridadJoven: ({territoriosId}) => `
        SELECT SUM(conteo) as conteo, sexo, nivelEducativo FROM (
            SELECT
                aes.sexo as sexo,
                'Ninguna' AS nivelEducativo,
                SUM(aes.Esc_Ninguna) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'NSNR' AS nivelEducativo,
                SUM(Esc_NSNR) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Preescolar' AS nivelEducativo,
                SUM(Esc_Preescolar) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Primaria' AS nivelEducativo,
                SUM(Esc_Primaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Media' AS nivelEducativo,
                SUM(Esc_Media) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Secundaria' AS nivelEducativo,
                SUM(Esc_Secundaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnico' AS nivelEducativo,
                SUM(Esc_Tecnico) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnologico' AS nivelEducativo,
                SUM(Esc_Tecnologica) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Incompleta' AS nivelEducativo,
                SUM(Esc_UniversitarioIncomp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Completa' AS nivelEducativo,
                SUM(Esc_UniversitarioComp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
                AND edad < 30
            GROUP BY aes.ID_CNIDA, aes.sexo
        ) GROUP BY nivelEducativo, sexo;`,
    escolaridad: ({territoriosId}) => `
        SELECT SUM(conteo) as conteo, sexo, nivelEducativo FROM (
            SELECT
                aes.sexo as sexo,
                'Ninguna' AS nivelEducativo,
                SUM(aes.Esc_Ninguna) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'NSNR' AS nivelEducativo,
                SUM(Esc_NSNR) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Preescolar' AS nivelEducativo,
                SUM(Esc_Preescolar) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Primaria' AS nivelEducativo,
                SUM(Esc_Primaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Media' AS nivelEducativo,
                SUM(Esc_Media) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Secundaria' AS nivelEducativo,
                SUM(Esc_Secundaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnico' AS nivelEducativo,
                SUM(Esc_Tecnico) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnologico' AS nivelEducativo,
                SUM(Esc_Tecnologica) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Incompleta' AS nivelEducativo,
                SUM(Esc_UniversitarioIncomp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Completa' AS nivelEducativo,
                SUM(Esc_UniversitarioComp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
        ) GROUP BY nivelEducativo, sexo;`,
    territorio: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    comunidadesEnTerritorio: ({territoriosId}) => `
        SELECT
            ST_AsGeoJSON(g.geo) AS geometry,
            g.NOMB_CNIDA AS nombre,
            g.ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\` g
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            g.ID_CNIDA = rcpt.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'g.ID_TI')};`
}

export default funciones;