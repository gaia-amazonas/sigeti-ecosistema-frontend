// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios.ts

const funciones = {
    sexoYLengua: `
        SELECT
            LENGUA_HAB AS lengua,
            SUM(NUM_HAB) AS conteo
        FROM
            \`sigeti.censo_632.Distribución_Lenguas\`
        GROUP BY
            LENGUA_HAB;`
    ,
    etnias: `
        SELECT
            ETNIA as etnia,
            SUM(CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\`
        GROUP BY
            etnia;`
    ,
    clanes: `
        SELECT
            COUNT(*) AS conteo,
            clan
        FROM
            \`sigeti.censo_632.BD_personas\`
        GROUP BY
            clan;`
    };

export default funciones;