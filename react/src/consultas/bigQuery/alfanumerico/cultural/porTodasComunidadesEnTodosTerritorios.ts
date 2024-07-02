// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios.ts

const funciones = {
    sexoYLengua: `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) + SUM(total_mujeres) AS conteo,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        GROUP BY
            nombre_lengua;`
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