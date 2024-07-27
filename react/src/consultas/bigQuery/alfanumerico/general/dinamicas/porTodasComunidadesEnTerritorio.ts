// src/consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTerritorio.ts
import haceClausulasWhere from "../../clausulas";

interface DatosParaConsultar {
  territoriosId: string[];
  comunidadesId: string[];
}

type Query = (datosParaConsultar: DatosParaConsultar, edades: {edadMinima: number, edadMaxima: number}) => string;

const funciones: Record<string, Query> = {
  sexo: ({ territoriosId }, { edadMinima, edadMaxima }) => `
    SELECT
      SEXO AS sexo,
      COUNT(*) AS cantidad
    FROM
      \`sigeti-admin-364713.050_censo.sexo_y_edad_por_comunidad_y_territorio\`
    WHERE
      ${haceClausulasWhere({ territoriosId }, 'ID_TI')}
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      SEXO;`,
  poblacionPorComunidad: ({ territoriosId }, { edadMinima, edadMaxima }) => `
    SELECT
      id_cnida AS comunidadId,
      comunidad AS comunidadNombre,
      COUNT(*) AS poblacionTotal
    FROM
      \`sigeti.censo_632.BD_personas\`
    WHERE
      ${haceClausulasWhere({ territoriosId }, 'id_ti')}
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      id_cnida, comunidad;`,

  familias: ({ territoriosId }, { edadMinima, edadMaxima }) => `
    SELECT
        COUNT(DISTINCT ID_FORM) familias
    FROM
        \`sigeti-admin-364713.050_censo.familias_y_edad\`
    WHERE
        ${haceClausulasWhere({territoriosId}, 'ID_TI')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima};`
  ,
  familiasPorComunidad: ({ territoriosId }, { edadMinima, edadMaxima }) => `
    SELECT
      COUNT(DISTINCT ID_FORM) as familias,
      ID_CNIDA as comunidadId,
      COMUNIDAD AS comunidadNombre
    FROM
      \`sigeti-admin-364713.050_censo.familias_y_edad\`
    WHERE
      ${haceClausulasWhere({territoriosId}, 'ID_TI')}
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      ID_CNIDA, COMUNIDAD;`
  ,
  familiasConElectricidadPorComunidad: ({ territoriosId }, { edadMinima, edadMaxima }) => `
    SELECT
      COUNT(*) AS familias,
      ID_CNIDA AS comunidadId
    FROM
      \`sigeti-admin-364713.050_censo.familias_edad_electricidad_comunidad_territorio\`
    WHERE
    ${haceClausulasWhere({ territoriosId }, 'ID_TI')}
      AND LOWER(VV_ELECT) IN ('sí', 'si')
      AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
      ID_CNIDA;`
  ,
  sexoEdad: ({ territoriosId }, { edadMinima, edadMaxima }) => {
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
        ${haceClausulasWhere({ territoriosId }, 'id_ti')}
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

  territorio: ({ territoriosId }) => `
    SELECT DISTINCT
      ST_AsGeoJSON(geometry) AS geometry,
      id_ti AS id,
      territorio AS nombre
    FROM
      \`sigeti.unidades_de_analisis.territorios_censo632\`
    WHERE
      ${haceClausulasWhere({ territoriosId }, 'id_ti')};`,

  comunidadesEnTerritorio: ({ territoriosId }) => `
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
      ${haceClausulasWhere({ territoriosId }, 'a.id_ti')};`
};

export default funciones;