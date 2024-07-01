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
    etniasEnComunidades: `
        SELECT
            ETNIA as etnia,
            SUM(CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\`
        GROUP BY
            etnia;`
    };

export default funciones;