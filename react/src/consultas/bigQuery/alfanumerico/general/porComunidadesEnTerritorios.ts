// src/consultas/bigQuery/alfanumerico/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexo: ({comunidadesId}) => `
        SELECT
            sexo,
            SUM(cantidad) AS cantidad 
        FROM
            \`sigeti-admin-364713.050_censo.sexos_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            sexo;`
    ,
    poblacionPorComunidad: ({comunidadesId}) => `
        SELECT
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre,
            ID_TI as territorioId
            SUM(personas) AS poblacionTotal
        FROM
            \`sigeti-admin-364713.050_censo.poblacion_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            ID_CNIDA, COMUNIDAD, ID_TI, TERRITORIO;`
    ,
    familias: ({comunidadesId}) => `
        SELECT
            SUM(familias) as familias
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')};`
    ,
    familiasPorComunidad: ({comunidadesId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA as comunidadId,
            COMUNIDAD AS comunidadNombre,
            ID_TI AS territorioId,
            TERRITORIO AS territorioNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            COMUNIDAD, ID_CNIDA, ID_TI, TERRITORIO;`
    ,
    familiasConElectricidadPorComunidad: ({comunidadesId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA AS comunidadId,
            ID_TI AS territorioId
        FROM
            \`sigeti-admin-364713.050_censo.familias_con_electricidad_por_comunidad_y_t\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'f.id_cnida')} AND 
        GROUP BY
            ID_CNIDA, ID_TI;`
    ,
    sexoEdad: ({comunidadesId}) => `
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
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY 
            grupoPorEdad,
            sexo, 
            ordenGrupoPorEdad
        ORDER BY 
            ordenGrupoPorEdad,
            sexo;`
    ,
    territorios: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    comunidadesEnTerritorios: ({comunidadesId}) => `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nombre,
            ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')};`
    ,
    comunidadesAgregadasEnTerritorios: ({territoriosId}) => `
        SELECT
            territorio AS territorioId,
            ARRAY_AGG(comunidad) AS comunidadesId
        FROM
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            territorio;`
    };


export default funciones;