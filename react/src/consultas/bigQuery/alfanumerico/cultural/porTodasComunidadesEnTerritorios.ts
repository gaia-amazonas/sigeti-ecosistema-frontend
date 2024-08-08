// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    pueblos: ({territoriosId}) => `
        SELECT
            id_cnida AS comunidadId,
            pueblo,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_pueblos_en_comunidades\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            pueblo, id_cnida;`,
    lenguas: ({territoriosId}) => `
        SELECT
            id_cnida as comunidadId,
            lengua AS lengua,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_lenguas_en_comunidades\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            lengua, id_cnida;`,
    etnias: ({territoriosId}) => `
        SELECT
            id_cnida AS comunidadId,
            etnia,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_etnias_en_comunidades\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            etnia, id_cnida;`,
    clanes: ({territoriosId}) => `
        SELECT
            id_cnida AS comunidadId,
            clan,
            COUNT(*) AS conteo
        FROM
            \`sigeti.NS_NC.BD_Personas\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            clan, id_cnida;`
    };

export default funciones;