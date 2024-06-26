// src/consultas/bigQuery/alfanumerico/porTodasComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexo: ({territoriosId}) => `
        SELECT
            SEXO AS sexo,
            COUNT(*) AS cantidad
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            id_cnida, sexo;`
    ,
    poblacionPorComunidad: ({territoriosId}) => `
        SELECT
            id_cnida AS comunidadId,
            comunidad AS comunidadNombre,
            COUNT(*) AS poblacionTotal
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            id_cnida, comunidad;`
    ,
    familias: ({territoriosId}) => `
        SELECT
            COUNT(*) AS familias
        FROM
            \`sigeti.censo_632.BD_familias\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')};`
    ,
    familiasPorComunidad: ({territoriosId}) => `
        SELECT
            COUNT(*) AS familias,
            c.id_cnida as comunidadId,
            c.comunidad AS comunidadNombre
        FROM
            \`sigeti.censo_632.BD_familias\` f
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` c
        ON
            f.id_cnida = c.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'c.id_ti')}
        GROUP BY
            c.comunidad, c.id_cnida;`
    ,
    familiasConElectricidadPorComunidad: ({territoriosId}) => `
        SELECT
            COUNT(*) AS familias,
            f.id_cnida AS comunidadId
        FROM
            \`sigeti.censo_632.BD_familias\` f
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` c
        ON
            f.id_cnida = c.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'f.id_ti')} AND 
            LOWER(f.vv_elect) IN ('sí', 'si')
        GROUP BY
            f.id_cnida;`
    ,
    sexoEdad: ({territoriosId}) => `
        SELECT 
            CASE 
                WHEN edad BETWEEN 0 AND 5 THEN '0 a 5 años'
                WHEN edad BETWEEN 6 AND 10 THEN '6 a 10 años'
                WHEN edad BETWEEN 11 AND 15 THEN '11 a 15 años'
                WHEN edad BETWEEN 16 AND 20 THEN '16 a 20 años'
                WHEN edad BETWEEN 21 AND 25 THEN '21 a 25 años'
                WHEN edad BETWEEN 26 AND 30 THEN '26 a 30 años'
                WHEN edad BETWEEN 31 AND 35 THEN '31 a 35 años'
                WHEN edad BETWEEN 36 AND 40 THEN '36 a 40 años'
                WHEN edad BETWEEN 41 AND 45 THEN '41 a 45 años'
                WHEN edad BETWEEN 46 AND 50 THEN '46 a 50 años'
                WHEN edad BETWEEN 51 AND 55 THEN '51 a 55 años'
                WHEN edad BETWEEN 56 AND 60 THEN '56 a 60 años'
                WHEN edad BETWEEN 61 AND 65 THEN '61 a 65 años'
                WHEN edad BETWEEN 66 AND 70 THEN '66 a 70 años'
                WHEN edad BETWEEN 71 AND 75 THEN '71 a 75 años'
                WHEN edad BETWEEN 76 AND 80 THEN '76 a 80 años'
                WHEN edad BETWEEN 81 AND 85 THEN '81 a 85 años'
                WHEN edad BETWEEN 86 AND 90 THEN '86 a 90 años'
                WHEN edad BETWEEN 91 AND 95 THEN '91 a 95 años'
                WHEN edad BETWEEN 96 AND 100 THEN '96 a 100 años'
                WHEN edad > 100 THEN 'más de 100 años '
                ELSE 'NS/NR'
            END AS grupoPorEdad,
            sexo,
            COUNT(*) AS contador,
            CASE 
                WHEN edad BETWEEN 0 AND 5 THEN 21
                WHEN edad BETWEEN 6 AND 10 THEN 20
                WHEN edad BETWEEN 11 AND 15 THEN 19
                WHEN edad BETWEEN 16 AND 20 THEN 18
                WHEN edad BETWEEN 21 AND 25 THEN 17
                WHEN edad BETWEEN 26 AND 30 THEN 16
                WHEN edad BETWEEN 31 AND 35 THEN 15
                WHEN edad BETWEEN 36 AND 40 THEN 14
                WHEN edad BETWEEN 41 AND 45 THEN 13
                WHEN edad BETWEEN 46 AND 50 THEN 12
                WHEN edad BETWEEN 51 AND 55 THEN 11
                WHEN edad BETWEEN 56 AND 60 THEN 10
                WHEN edad BETWEEN 61 AND 65 THEN 9
                WHEN edad BETWEEN 66 AND 70 THEN 8
                WHEN edad BETWEEN 71 AND 75 THEN 7
                WHEN edad BETWEEN 76 AND 80 THEN 6
                WHEN edad BETWEEN 81 AND 85 THEN 5
                WHEN edad BETWEEN 86 AND 90 THEN 4
                WHEN edad BETWEEN 91 AND 95 THEN 3
                WHEN edad BETWEEN 96 AND 100 THEN 2
                WHEN edad > 100 THEN 1
                ELSE 0
            END AS ordenGrupoPorEdad
        FROM 
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY 
            grupoPorEdad,
            sexo, 
            ordenGrupoPorEdad
        ORDER BY 
            ordenGrupoPorEdad,
            sexo;`
    ,
    territorio: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geometry) AS geometry,
            id_ti AS id,
            territorio AS nombre
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')};`
    ,
    comunidadesEnTerritorio: ({territoriosId}) => `
        SELECT
            ST_AsGeoJSON(g.geometry) AS geometry,
            g.nomb_cnida AS nombre,
            g.id_cnida AS id
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\` g
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` a
        ON
            a.id_cnida = g.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')};`
    
};

export default funciones;