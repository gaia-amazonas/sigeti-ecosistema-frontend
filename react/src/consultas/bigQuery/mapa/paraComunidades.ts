// src/consultas/bigQuery/paraComunidades.ts

const consultasBigQueryParaComunidades = {
    comunidades: `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nomb_cnida,
            ID_CNIDA AS id_cnida
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`;`
    ,
    nombreComunidad: (comunidadId: string) => `
        SELECT
            NOMB_CNIDA
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
        WHERE
            ID_CNIDA = '${comunidadId}';`
    ,
    sexo_edad: (comunidadId: string) => `
        SELECT 
            CASE 
                WHEN edad BETWEEN 0 AND 5 THEN '0-5'
                WHEN edad BETWEEN 6 AND 10 THEN '6-10'
                WHEN edad BETWEEN 11 AND 15 THEN '11-15'
                WHEN edad BETWEEN 16 AND 20 THEN '16-20'
                WHEN edad BETWEEN 21 AND 25 THEN '21-25'
                WHEN edad BETWEEN 26 AND 30 THEN '26-30'
                WHEN edad BETWEEN 31 AND 35 THEN '31-35'
                WHEN edad BETWEEN 36 AND 40 THEN '36-40'
                WHEN edad BETWEEN 41 AND 45 THEN '41-45'
                WHEN edad BETWEEN 46 AND 50 THEN '46-50'
                WHEN edad BETWEEN 51 AND 55 THEN '51-55'
                WHEN edad BETWEEN 56 AND 60 THEN '56-60'
                WHEN edad BETWEEN 61 AND 65 THEN '61-65'
                WHEN edad BETWEEN 66 AND 70 THEN '66-70'
                WHEN edad BETWEEN 71 AND 75 THEN '71-75'
                WHEN edad BETWEEN 76 AND 80 THEN '76-80'
                WHEN edad BETWEEN 81 AND 85 THEN '81-85'
                WHEN edad BETWEEN 86 AND 90 THEN '86-90'
                WHEN edad BETWEEN 91 AND 95 THEN '91-95'
                WHEN edad BETWEEN 96 AND 100 THEN '96-100'
                WHEN edad > 100 THEN '100+'
                ELSE '?'
            END AS age_group,
            sexo,
            COUNT(*) AS count,
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
            END AS age_group_order
        FROM 
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ID_CNIDA = '${comunidadId}'
        GROUP BY 
            age_group, 
            sexo, 
            age_group_order
        ORDER BY 
            age_group_order, 
            sexo;`
    ,
    territorio: (comunidadId: string) => `
        SELECT
            ST_AsGeoJSON(t.geo) as geometry,
            t.ID_TI as id_ti,
            t.NOMBRE_TI as territorio
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_20240527\` AS t
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` AS c
        ON
            t.id_ti = c.id_ti
        WHERE
            c.id_cnida = '${comunidadId}';`,
    nombreTerritorio: (comunidadId: string) => `
        SELECT
            t.NOMBRE_TI as nombreTerritorio
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_20240527\` AS t
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` AS c
        ON
            t.id_ti = c.id_ti
        WHERE
            c.id_cnida = '${comunidadId}';`,
    sexo: (comunidadId: string) => `
        SELECT
            SEXO, COUNT(*) 
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            id_cnida = '${comunidadId}'
        GROUP BY
            id_cnida, sexo;`
    ,
    familias: (comunidadId: string) => `
        SELECT
            COUNT(*) as familias
        FROM
            \`sigeti.censo_632.BD_familias\`
        WHERE
            id_cnida = '${comunidadId}';`
    ,
    pueblos: (comunidadId: string) => `
        SELECT
            PUEBLO
        FROM
            \`sigeti.censo_632.Conteo_Pueblos\`
        WHERE
            ID_CNIDA='${comunidadId}';`
    ,
    sexosPorComunidad : `
        SELECT
            c.ID_CNIDA as id,
            c.NOMB_CNIDA as nombre,
            COUNT(f.id_cnida) as familias,
            COUNT(CASE WHEN p.SEXO = 'Hombre' THEN 1 END) as hombres,
            COUNT(CASE WHEN p.SEXO = 'Mujer' THEN 1 END) as mujeres,
            STRING_AGG(DISTINCT p.PUEBLO, ', ') as pueblos
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\` c
        LEFT JOIN
            \`sigeti.censo_632.BD_familias\` f ON c.ID_CNIDA = f.id_cnida
        LEFT JOIN
            \`sigeti.censo_632.BD_personas\` p ON c.ID_CNIDA = p.id_cnida
        GROUP BY
            c.ID_CNIDA, c.NOMB_CNIDA;`,
    infraestructura: (comunidadesId: string[]) => {
        const sqlTemplate = `
            WITH tipos AS (
            SELECT 'Educativa' AS tipo
            UNION ALL
            SELECT 'Salud'
            UNION ALL
            SELECT 'Malocas'
            ),
            educacion AS (
            SELECT
                COUNT(*) AS conteo,
                'Educativa' AS tipo,
                id_cnida AS comunidadId
            FROM \`sigeti-admin-364713.censo_632.educacion_infrastructura\`
            WHERE id_cnida IN ({comunidadesId})
            GROUP BY id_cnida
            ),
            salud AS (
            SELECT
                COUNT(*) AS conteo,
                'Salud' AS tipo,
                id_cnida AS comunidadId
            FROM \`sigeti-admin-364713.Salud.Infraestructura_Puestos_Salud\`
            WHERE id_cnida IN ({comunidadesId})
            GROUP BY id_cnida
            ),
            malocas AS (
            SELECT
                COALESCE(SUM(infr_totmalocas), 0) AS conteo,
                'Malocas' AS tipo,
                id_cnida AS comunidadId
            FROM \`sigeti-admin-364713.censo_632.infrastructura_malocas\`
            WHERE id_cnida IN ({comunidadesId})
            GROUP BY id_cnida
            )

            SELECT
            COALESCE(e.conteo, s.conteo, m.conteo, 0) AS conteo,
            t.tipo,
            COALESCE(e.comunidadId, s.comunidadId, m.comunidadId) AS comunidadId
            FROM
            tipos t
            LEFT JOIN educacion e ON t.tipo = e.tipo
            LEFT JOIN salud s ON t.tipo = s.tipo
            LEFT JOIN malocas m ON t.tipo = m.tipo
            WHERE COALESCE(e.comunidadId, s.comunidadId, m.comunidadId) IN ({comunidadesId});
            `;
        const idCnidaString = comunidadesId.map(id => `'${id}'`).join(', ');
        const finalSQL = sqlTemplate.replace(/{comunidadesId}/g, idCnidaString);
        return finalSQL;
    }
}

export default consultasBigQueryParaComunidades;