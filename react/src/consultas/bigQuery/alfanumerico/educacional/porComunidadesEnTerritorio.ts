// src/consultas/bigQuery/alfanumerico/educacional/porComunidadesEnTerritorio.ts

import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]}) => string;

const funciones: Record<string, Query> = {
    escolaridadJoven: ({comunidadesId}) => `
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Ninguna' AS nivelEducativo,
            SUM(Esc_Ninguna) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'NSNR' AS nivelEducativo,
            SUM(Esc_NSNR) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Preescolar' AS nivelEducativo,
            SUM(Esc_Preescolar) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Primaria' AS nivelEducativo,
            SUM(Esc_Primaria) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Media' AS nivelEducativo,
            SUM(Esc_Media) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Secundaria' AS nivelEducativo,
            SUM(Esc_Secundaria) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Tecnico' AS nivelEducativo,
            SUM(Esc_Tecnico) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Tecnologico' AS nivelEducativo,
            SUM(Esc_Tecnologica) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Universitaria Incompleta' AS nivelEducativo,
            SUM(Esc_UniversitarioIncomp) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Universitaria Completa' AS nivelEducativo,
            SUM(Esc_UniversitarioComp) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
            AND edad < 30
        GROUP BY ID_CNIDA, sexo;`,
    escolaridad: ({comunidadesId}) => `
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Ninguna' AS nivelEducativo,
            SUM(Esc_Ninguna) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'NSNR' AS nivelEducativo,
            SUM(Esc_NSNR) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Preescolar' AS nivelEducativo,
            SUM(Esc_Preescolar) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Primaria' AS nivelEducativo,
            SUM(Esc_Primaria) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Media' AS nivelEducativo,
            SUM(Esc_Media) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Secundaria' AS nivelEducativo,
            SUM(Esc_Secundaria) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Tecnico' AS nivelEducativo,
            SUM(Esc_Tecnico) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Tecnologico' AS nivelEducativo,
            SUM(Esc_Tecnologica) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Universitaria Incompleta' AS nivelEducativo,
            SUM(Esc_UniversitarioIncomp) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo
        UNION ALL
        SELECT
            ID_CNIDA as comunidadId,
            sexo,
            'Universitaria Completa' AS nivelEducativo,
            SUM(Esc_UniversitarioComp) AS conteo
        FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\`
        WHERE ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY ID_CNIDA, sexo;`
};

export default funciones;