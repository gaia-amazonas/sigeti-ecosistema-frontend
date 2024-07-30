// src/consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTodosTerritorios.ts

import haceClausulasWhere from "../clausulas";

type Query = (territoriosPrivados?: string[]) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: (territoriosPrivados) => `
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
            edad >= 5 AND edad < 14
        GROUP BY
            comunidadId, escolarizacion;
    `,
    escolaridadJoven: () => `
        SELECT SUM(conteo) as conteo, sexo, nivelEducativo FROM (
            SELECT
                sexo as sexo,
                'Ninguna' AS nivelEducativo,
                SUM(Esc_Ninguna) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'NSNR' AS nivelEducativo,
                SUM(Esc_NSNR) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Preescolar' AS nivelEducativo,
                SUM(Esc_Preescolar) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Primaria' AS nivelEducativo,
                SUM(Esc_Primaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Media' AS nivelEducativo,
                SUM(Esc_Media) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Secundaria' AS nivelEducativo,
                SUM(Esc_Secundaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Tecnico' AS nivelEducativo,
                SUM(Esc_Tecnico) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Tecnologico' AS nivelEducativo,
                SUM(Esc_Tecnologica) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Universitaria Incompleta' AS nivelEducativo,
                SUM(Esc_UniversitarioIncomp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Universitaria Completa' AS nivelEducativo,
                SUM(Esc_UniversitarioComp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE edad < 30
            GROUP BY ID_CNIDA, sexo
        ) GROUP BY nivelEducativo, sexo;`,
    escolaridad: () => `
        SELECT SUM(conteo) as conteo, sexo, nivelEducativo FROM (
            SELECT
                sexo as sexo,
                'Ninguna' AS nivelEducativo,
                SUM(Esc_Ninguna) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'NSNR' AS nivelEducativo,
                SUM(Esc_NSNR) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Preescolar' AS nivelEducativo,
                SUM(Esc_Preescolar) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Primaria' AS nivelEducativo,
                SUM(Esc_Primaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Media' AS nivelEducativo,
                SUM(Esc_Media) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Secundaria' AS nivelEducativo,
                SUM(Esc_Secundaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Tecnico' AS nivelEducativo,
                SUM(Esc_Tecnico) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Tecnologico' AS nivelEducativo,
                SUM(Esc_Tecnologica) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Universitaria Incompleta' AS nivelEducativo,
                SUM(Esc_UniversitarioIncomp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
            UNION ALL
            SELECT
                sexo as sexo,
                'Universitaria Completa' AS nivelEducativo,
                SUM(Esc_UniversitarioComp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            GROUP BY ID_CNIDA, sexo
        ) GROUP BY nivelEducativo, sexo;`,
    territorios: () => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`;`
    ,
    comunidadesEnTerritorios: () => `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nombre,
            ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`;`
}

export default funciones;