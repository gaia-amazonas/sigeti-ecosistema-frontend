// src/components/consultas/generales/porTerritorio.ts

type Query = (territoriosId: string[]) => string;

const porTerritorio: Record<string, Query> = {
    sexo: (comunidadesId: string[]) => `
        SELECT
            SEXO, COUNT(*) 
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            ${haceClausulasWhere(comunidadesId, 'id_cnida')}
        GROUP BY
            id_cnida, sexo, id_ti;`,
    familias: (comunidadesId: string[]) => `
        SELECT
            COUNT(*) as familias
        FROM
            \`sigeti.censo_632.BD_familias\`
        WHERE
            ${haceClausulasWhere(comunidadesId, 'id_cnida')};`,
    sexo_edad: (comunidadesId: string[]) => `
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
            ${haceClausulasWhere(comunidadesId, 'ID_CNIDA')}
        GROUP BY 
            age_group, 
            sexo, 
            age_group_order
        ORDER BY 
            age_group_order, 
            sexo;`,
    territorio: (comunidadesId: string[]) => `
        SELECT
            ST_AsGeoJSON(t.geometry) as geometry,
            t.id_ti as id_ti,
            t.territorio as territorio
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\` AS t
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` AS c
        ON
            t.id_ti = c.id_ti
        WHERE
            ${haceClausulasWhere(comunidadesId, 'c.id_cnida')};`,
    comunidades_en_territorio: (comunidadesId: string[]) => `
        SELECT
            c.geometry,
            c.nomb_cnida
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\` AS c
        WHERE
            ${haceClausulasWhere(comunidadesId, 'c.id_cnida')};`
    };


export default porTerritorio;

const haceClausulasWhere = (comunidadesId: string[], variable: string) => {
    return comunidadesId.length > 0 ? comunidadesId.map(id => `${variable} = '${id}'`).join(' OR '): `${variable} = '${comunidadesId[0]}'`;
}