// src/consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTodosTerritorios.ts

const porTodasComunidadesEnTodosTerritorios = {
    sexo: generarQuerySexo,
    familias: generarQueryFamilias,
    sexoEdad: generarQuerySexoEdad,
    familiasPorComunidad: generarQueryFamiliasPorComunidad,
    poblacionPorComunidad: generarQueryPoblacionPorComunidad,
    familiasConElectricidadPorComunidad: generarQueryFamiliasConElectricidadPorComunidad,
};

export default porTodasComunidadesEnTodosTerritorios;

function generarQuerySexoEdad(minAge: number, maxAge: number): string {
    let caseStatements: string[] = [];
    let orderCaseStatements: string[] = [];
    let currentOrder = 1;

    for (let age = minAge; age <= maxAge; age += 5) {
        let upperBound = age + 4;
        if (upperBound > maxAge) upperBound = maxAge;

        caseStatements.push(`WHEN edad BETWEEN ${age} AND ${upperBound} THEN '${age} a ${upperBound} años'`);
        orderCaseStatements.push(`WHEN edad BETWEEN ${age} AND ${upperBound} THEN ${currentOrder}`);

        currentOrder++;
    }

    const query = `
        SELECT 
            CASE 
                ${caseStatements.join('\n                ')}
                ELSE 'NS/NR'
            END AS grupoPorEdad,
            sexo,
            COUNT(*) AS contador,
            CASE 
                ${orderCaseStatements.join('\n                ')}
                ELSE 0
            END AS ordenGrupoPorEdad
        FROM 
            \`sigeti.censo_632.BD_personas\`
        WHERE 
            edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY 
            grupoPorEdad,
            sexo, 
            ordenGrupoPorEdad
        ORDER BY 
            ordenGrupoPorEdad,
            sexo;
    `;

    return query;
}

function generarQuerySexo(minAge: number, maxAge: number): string {
    const query = `
        SELECT
            SEXO AS sexo,
            COUNT(*) AS cantidad 
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY
            sexo;
    `;

    return query;
}

function generarQueryPoblacionPorComunidad(minAge: number, maxAge: number): string {
    const query = `
        SELECT
            id_cnida AS comunidadId,
            comunidad AS comunidadNombre,
            COUNT(*) AS poblacionTotal
        FROM
            \`sigeti.censo_632.BD_personas\`
        WHERE
            edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY
            id_cnida, comunidad;
    `;

    return query;
}

function generarQueryFamilias(minAge: number, maxAge: number): string {
    const query = `
        SELECT
            COUNT(*) as familias
        FROM
            \`sigeti.censo_632.BD_familias\` f
        JOIN
            \`sigeti.censo_632.BD_personas\` p
        ON
            f.numero_id = p.numero_id
        WHERE
            p.edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY
            f.numero_id;
    `;
    return query;
}

function generarQueryFamiliasPorComunidad(minAge: number, maxAge: number): string {
    const query = `
        SELECT
            COUNT(*) AS familias,
            c.comunidad AS comunidadNombre,
            c.id_cnida AS comunidadId,
            f.numero_id AS lider
        FROM
            \`sigeti.censo_632.BD_familias\` f
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` c
        ON
            f.id_cnida = c.id_cnida
        JOIN
            \`sigeti.censo_632.BD_personas\` p
        ON
            f.numero_id = p.numero_id
        WHERE
            p.edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY
            c.comunidad, c.id_cnida, f.numero_id;
    `;

    return query;
}

function generarQueryFamiliasConElectricidadPorComunidad(minAge: number, maxAge: number): string {
    const query = `
        SELECT
            COUNT(*) AS familias,
            f.id_cnida AS comunidadId,
            f.numero_id AS lider
        FROM
            \`sigeti.censo_632.BD_familias\` f
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` c
        ON
            f.id_cnida = c.id_cnida
        JOIN
            \`sigeti.censo_632.BD_personas\` p
        ON
            f.numero_id = p.numero_id
        WHERE
            LOWER(f.vv_elect) IN ('sí', 'si')
            AND p.edad BETWEEN ${minAge} AND ${maxAge}
        GROUP BY
            f.id_cnida, f.numero_id;
    `;

    return query;
}
