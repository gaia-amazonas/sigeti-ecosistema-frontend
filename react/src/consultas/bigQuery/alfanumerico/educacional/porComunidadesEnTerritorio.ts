// src/consultas/bigQuery/alfanumerico/educacional/porComunidadesEnTerritorio.ts

import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]}, territoriosPrivados?: string[]) => string;

const funciones: Record<string, Query> = {
    escolaridadPrimariaYSecundaria: ({ comunidadesId }, territoriosPrivados) => `
        SELECT
            epss.comunidadId, epss.escolarizacion, COUNT(*) conteo
        FROM
            \`sigeti.censo_632.escolarizacion_primaria_y_secundaria_segmentada\` epss
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            epss.comunidadId = rcpt.id_cnida
        WHERE
            (${haceClausulasWhere({territoriosPrivados}, 'rcpt.id_ti')}) AND
            epss.educacion = 'Primaria' AND
            epss.edad >= 5 AND epss.edad < 14 AND
            ${haceClausulasWhere({comunidadesId}, 'epss.comunidadId')}
        GROUP BY
            comunidadId, escolarizacion;
    `,
    escolaridadJoven: ({comunidadesId}) => `
        WITH FilteredData AS (
            SELECT 
                sexo, 
                edad,
                ID_CNIDA,
                Esc_Ninguna, 
                Esc_NSNR, 
                Esc_Preescolar, 
                Esc_Primaria, 
                Esc_Media, 
                Esc_Secundaria, 
                Esc_Tecnico, 
                Esc_Tecnologica, 
                Esc_UniversitarioIncomp, 
                Esc_UniversitarioComp
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE
                ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
                AND edad < 30
        )
        SELECT 
            sexo, 
            'Ninguna' AS nivelEducativo, 
            SUM(Esc_Ninguna) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'NSNR' AS nivelEducativo, 
            SUM(Esc_NSNR) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Preescolar' AS nivelEducativo, 
            SUM(Esc_Preescolar) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Primaria' AS nivelEducativo, 
            SUM(Esc_Primaria) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Media' AS nivelEducativo, 
            SUM(Esc_Media) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Secundaria' AS nivelEducativo, 
            SUM(Esc_Secundaria) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Tecnico' AS nivelEducativo, 
            SUM(Esc_Tecnico) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Tecnologico' AS nivelEducativo, 
            SUM(Esc_Tecnologica) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Universitaria Incompleta' AS nivelEducativo, 
            SUM(Esc_UniversitarioIncomp) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Universitaria Completa' AS nivelEducativo, 
            SUM(Esc_UniversitarioComp) AS conteo 
        FROM FilteredData 
        GROUP BY sexo;`,
    escolaridad: ({comunidadesId}) => `
        WITH FilteredData AS (
            SELECT 
                sexo, 
                edad,
                ID_CNIDA,
                Esc_Ninguna, 
                Esc_NSNR, 
                Esc_Preescolar, 
                Esc_Primaria, 
                Esc_Media, 
                Esc_Secundaria, 
                Esc_Tecnico, 
                Esc_Tecnologica, 
                Esc_UniversitarioIncomp, 
                Esc_UniversitarioComp
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
            WHERE
                ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        )
        SELECT 
            sexo, 
            'Ninguna' AS nivelEducativo, 
            SUM(Esc_Ninguna) AS conteo 
        FROM FilteredData 
        GROUP BY sexo
        
        UNION ALL

        SELECT 
            sexo, 
            'NSNR' AS nivelEducativo, 
            SUM(Esc_NSNR) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Preescolar' AS nivelEducativo, 
            SUM(Esc_Preescolar) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Primaria' AS nivelEducativo, 
            SUM(Esc_Primaria) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Media' AS nivelEducativo, 
            SUM(Esc_Media) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Secundaria' AS nivelEducativo, 
            SUM(Esc_Secundaria) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Tecnico' AS nivelEducativo, 
            SUM(Esc_Tecnico) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Tecnologico' AS nivelEducativo, 
            SUM(Esc_Tecnologica) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Universitaria Incompleta' AS nivelEducativo, 
            SUM(Esc_UniversitarioIncomp) AS conteo 
        FROM FilteredData 
        GROUP BY sexo

        UNION ALL

        SELECT 
            sexo, 
            'Universitaria Completa' AS nivelEducativo, 
            SUM(Esc_UniversitarioComp) AS conteo 
        FROM FilteredData 
        GROUP BY sexo;`,
    territorio: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geometry) AS geometry,
            id_ti AS id,
            territorio AS nombre
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')};`
    ,
    comunidadesEnTerritorio: ({comunidadesId}) => `
        SELECT
            ST_AsGeoJSON(c.geometry) AS geometry,
            c.id_cnida AS id,
            c.nomb_cnida AS nombre
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\` AS c
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'c.id_cnida')};`
};

export default funciones;