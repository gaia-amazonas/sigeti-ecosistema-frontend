// src/consultas/espaciales/paraLineasColindates.ts
export const consultasEspacialesBigQueryParaLineasColindantes = {
  lineas: `
    SELECT
      ST_AsGeoJSON(geo) AS geometry,
      OBJECTID,
    FROM
      \`sigeti-admin-364713.analysis_units.LineasColindantes\`;
  `
};

export const consultasEspacialesPostgreSQLParaLineasColindates = {
  lineas: `SELECT * FROM sigetiescritorio.lineascolindantes_ln;`,
  territorios: `SELECT * FROM sigetiescritorio.territoriosindigenas_pg;`
}