// src/consultas/bigQuery/alfanumerico/general/dinamicas/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../../clausulas";

interface DatosParaConsultar {
  comunidadesId: string[];
  territoriosId: string[];
}

type Query = (datosParaConsultar: DatosParaConsultar, edades: {edadMinima: number, edadMaxima: number}) => string;

const funciones: Record<string, Query> = {
  sexo: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
      SEXO AS sexo,
      COUNT(*) AS cantidad
    FROM
      \`sigeti.censo_632.BD_personas\`
    WHERE
      ${haceClausulasWhere({ comunidadesId }, 'id_cnida')}
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      id_cnida, sexo;`,

  poblacionPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
      id_cnida AS comunidadId,
      comunidad AS comunidadNombre,
      id_ti AS territorioId,
      territorio AS territorioNombre,
      COUNT(*) AS poblacionTotal
    FROM
      \`sigeti.censo_632.BD_personas\`
    WHERE
      ${haceClausulasWhere({ comunidadesId }, 'id_cnida')}
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      id_cnida, comunidad, id_ti, territorio;`,

  familias: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias
    FROM
      \`sigeti.censo_632.BD_familias\` f
    JOIN
      \`sigeti.censo_632.BD_personas\` p
    ON
      f.numero_id = p.numero_id
    WHERE
      ${haceClausulasWhere({ comunidadesId }, 'f.id_cnida')}
      AND p.edad BETWEEN ${edadMinima} AND ${edadMaxima};`,

  familiasPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias,
      c.id_cnida as comunidadId,
      c.comunidad AS comunidadNombre,
      c.id_ti AS territorioId,
      c.territorio AS territorioNombre,
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
      ${haceClausulasWhere({ comunidadesId }, 'f.id_cnida')}
      AND p.edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      c.comunidad, c.id_cnida, c.territorio, c.id_ti, f.numero_id;`,

  familiasConElectricidadPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias,
      f.id_cnida AS comunidadId,
      f.id_ti AS territorioId
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
      ${haceClausulasWhere({ comunidadesId }, 'f.id_cnida')}
      AND LOWER(f.vv_elect) IN ('sí', 'si')
      AND p.edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      f.id_cnida, f.id_ti;`,

  sexoEdad: ({ comunidadesId }, { edadMinima, edadMaxima }) => {
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
        ${haceClausulasWhere({ comunidadesId }, 'id_cnida')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
      GROUP BY 
        grupoPorEdad,
        sexo, 
        ordenGrupoPorEdad
      ORDER BY 
        ordenGrupoPorEdad,
        sexo;
    `;
  },
  territorios: ({ territoriosId }) => `
    SELECT DISTINCT
      ST_AsGeoJSON(geometry) AS geometry,
      id_ti AS id,
      territorio AS nombre
    FROM
      \`sigeti.unidades_de_analisis.territorios_censo632\`
    WHERE
      ${haceClausulasWhere({ territoriosId }, 'id_ti')};`
  ,
  comunidadesEnTerritorios: ({ comunidadesId }) => `
    SELECT
      ST_AsGeoJSON(geometry) AS geometry,
      id_cnida AS id,
      nomb_cnida AS nombre
    FROM
      \`sigeti.unidades_de_analisis.comunidades_censo632\`
    WHERE
      ${haceClausulasWhere({ comunidadesId }, 'id_cnida')};`,

  comunidadesAgregadasEnTerritorios: ({ territoriosId }) => `
    SELECT
      territorio AS territorioId,
      ARRAY_AGG(comunidad) AS comunidadesId
    FROM
      \`sigeti.censo_632.comunidades_por_territorio\`
    WHERE
      ${haceClausulasWhere({ territoriosId }, 'id_ti')}
    GROUP BY
      territorio;`
};

export default funciones;