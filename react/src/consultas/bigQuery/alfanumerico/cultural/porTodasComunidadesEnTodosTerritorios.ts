// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios.ts

const funciones = {
    pueblos: `
        SELECT
            id_cnida AS comunidadId,
            pueblo,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_pueblos_en_comunidades\`
        GROUP BY
            pueblo, id_cnida;`,
    lenguas: `
        SELECT
            id_cnida as comunidadId,
            lengua AS lengua,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_lenguas_en_comunidades\`
        GROUP BY
            lengua, id_cnida;`
    ,
    etnias: `
        SELECT
            id_cnida AS comunidadId,
            etnia,
            SUM(conteo) AS conteo
        FROM
            \`sigeti.NS_NC.conteo_etnias_en_comunidades\`
        GROUP BY
            etnia, id_cnida;`
    ,
    clanes: `
        SELECT
            id_cnida AS comunidadId,
            clan,
            COUNT(*) AS conteo
        FROM
            \`sigeti.NS_NC.BD_Personas\`
        GROUP BY
            clan, id_cnida;`
    };

export default funciones;