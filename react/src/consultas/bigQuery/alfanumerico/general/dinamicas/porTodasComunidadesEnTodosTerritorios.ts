// src/consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTodosTerritorios.ts

const porTodasComunidadesEnTodosTerritorios = {
    sexoEdad: generarQuerySexoEdad
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