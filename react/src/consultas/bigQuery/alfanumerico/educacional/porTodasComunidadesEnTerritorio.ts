// src/consultas/bigQuery/alfanumerico/educacional/porTodasComunidadesEnTerritorio.ts

import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {territoriosId: string[], comunidadesId: string[]}) => string;

const funciones: Record<string, Query> = {
    escolaridadJoven: ({territoriosId}) => `
        SELECT SUM(conteo) as conteo, sexo, nivelEducativo FROM (
            SELECT
                aes.sexo as sexo,
                'Ninguna' AS nivelEducativo,
                SUM(aes.Esc_Ninguna) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
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
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'NSNR' AS nivelEducativo,
                SUM(Esc_NSNR) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Preescolar' AS nivelEducativo,
                SUM(Esc_Preescolar) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Primaria' AS nivelEducativo,
                SUM(Esc_Primaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Media' AS nivelEducativo,
                SUM(Esc_Media) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Secundaria' AS nivelEducativo,
                SUM(Esc_Secundaria) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnico' AS nivelEducativo,
                SUM(Esc_Tecnico) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Tecnologico' AS nivelEducativo,
                SUM(Esc_Tecnologica) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Incompleta' AS nivelEducativo,
                SUM(Esc_UniversitarioIncomp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
            UNION ALL
            SELECT
                aes.sexo as sexo,
                'Universitaria Completa' AS nivelEducativo,
                SUM(Esc_UniversitarioComp) AS conteo
            FROM \`sigeti.censo_632.Alfabetismo_Edad_Sexo\` aes
            JOIN \`sigeti.censo_632.comunidades_por_territorio\` cpt
            ON cpt.territorio = aes.TERRITORIO
            WHERE ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
            GROUP BY aes.ID_CNIDA, aes.sexo
        ) GROUP BY nivelEducativo, sexo;`,
}

export default funciones;