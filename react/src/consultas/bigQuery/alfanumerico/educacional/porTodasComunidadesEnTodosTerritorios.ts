// src/consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTerritorio.ts

const funciones = {
    escolaridadJoven: `
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
    escolaridad: `
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
}

export default funciones;