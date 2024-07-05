// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorios.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexoYLengua: ({territoriosId}) => `
        SELECT
            LENGUA_HAB AS lengua,
            SUM(NUM_HAB) AS conteo
        FROM
            \`sigeti.censo_632.Distribución_Lenguas\` dl
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cpt
        ON
            dl.TERRITORIO = cpt.territorio
        WHERE
            ${haceClausulasWhere({territoriosId}, 'cpt.id_ti')}
        GROUP BY
            LENGUA_HAB;`
    ,
    etnias: ({territoriosId}) => `
        SELECT
            ce.ETNIA as etnia,
            SUM(ce.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\` ce
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cp
        ON
            ce.ID_CNIDA = cp.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'cp.id_ti')}
        GROUP BY
            etnia;`
    ,
    clanes: ({territoriosId}) => `
        SELECT
            COUNT(*) AS conteo,
            clan
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            clan;`
    };

export default funciones;