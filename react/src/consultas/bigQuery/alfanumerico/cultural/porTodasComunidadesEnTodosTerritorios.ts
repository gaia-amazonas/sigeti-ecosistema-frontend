// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios.ts

const funciones = {
    sexo: `
        SELECT
            nombre_lengua AS lengua,
            SUM(total_hombres) AS hombres, 
            SUM(total_mujeres) AS mujeres,
            ANY_VALUE(comunidad) AS nombreComunidad
        FROM
            \`sigeti.censo_632.distribucion_lenguas_por_comunidad\`
        GROUP BY
            nombre_lengua;`
    };

export default funciones;