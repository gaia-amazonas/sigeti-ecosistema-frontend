// src/consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTodosTerritorios.ts
import haceClausulasWhere from "../../clausulas";

type Query = (edades: {edadMinima: number, edadMaxima: number}) => string;

const funciones: Record<string, Query> = {
  sexo: ({ edadMinima, edadMaxima }) => `
    SELECT
      SEXO AS sexo,
      COUNT(*) AS cantidad
    FROM
      \`sigeti.censo_632.BD_personas\`
    WHERE
      edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      sexo;`,

  poblacionPorComunidad: ({ edadMinima, edadMaxima }) => `
    SELECT
      id_cnida AS comunidadId,
      comunidad AS comunidadNombre,
      COUNT(*) AS poblacionTotal
    FROM
      \`sigeti.censo_632.BD_personas\`
    WHERE
      edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      id_cnida, comunidad;`,

  familias: ({ edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias
    FROM
      \`sigeti.censo_632.BD_familias\`
    WHERE
      edad BETWEEN ${edadMinima} AND ${edadMaxima};`,

  familiasPorComunidad: ({ edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias,
      c.comunidad AS comunidadNombre,
      c.id_cnida AS comunidadId
    FROM
      \`sigeti.censo_632.BD_familias\` f
    JOIN
      \`sigeti.censo_632.comunidades_por_territorio\` c
    ON
      f.id_cnida = c.id_cnida
    WHERE
      p.edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      c.comunidad, c.id_cnida, c.territorio, c.id_ti, f.numero_id;`,

  familiasConElectricidadPorComunidad: ({ edadMinima, edadMaxima }) => `
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
      LOWER(f.vv_elect) IN ('sí', 'si')
      AND p.edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      f.id_cnida, f.id_ti;`,

  sexoEdad: ({ edadMinima, edadMaxima }) => {
    let caseStatements: string[] = [];
    let orderCaseStatements: string[] = [];
    let currentOrder = 1;

    for (let age = edadMinima; age <= edadMaxima; age += 5) {
      let upperBound = age + 4;
      if (upperBound > edadMaxima) upperBound = edadMaxima;

      caseStatements.push(`WHEN edad BETWEEN ${age} AND ${upperBound} THEN '${age} a ${upperBound} años'`);
      orderCaseStatements.push(`WHEN edad BETWEEN ${age} AND ${upperBound} THEN ${currentOrder}`);

      currentOrder++;
    }

    return `
      SELECT 
        CASE 
          ${caseStatements.join('\n          ')}
          ELSE 'NS/NR'
        END AS grupoPorEdad,
        sexo,
        COUNT(*) AS contador,
        CASE 
          ${orderCaseStatements.join('\n          ')}
          ELSE 0
        END AS ordenGrupoPorEdad
      FROM 
        \`sigeti.censo_632.BD_personas\`
      WHERE
        edad BETWEEN ${edadMinima} AND ${edadMaxima}
      GROUP BY 
        grupoPorEdad,
        sexo, 
        ordenGrupoPorEdad
      ORDER BY 
        ordenGrupoPorEdad,
        sexo;
    `;
  }
};

export default funciones;
