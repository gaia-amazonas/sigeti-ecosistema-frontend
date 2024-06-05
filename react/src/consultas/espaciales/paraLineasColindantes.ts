// src/consultas/espaciales/paraLineasColindates.ts
export const consultasEspacialesBigQuery = {
  lineas: `
    SELECT
      ST_AsGeoJSON(geo) AS geometry,
      OBJECTID,
    FROM
      \`sigeti-admin-364713.analysis_units.LineasColindantes\`;
  `,
  territorios: `
    SELECT
      ST_AsGeoJSON(geo) AS geometry,
      ID_TI AS id_ti,
      NOMBRE_TI AS territorio
    FROM
      \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_20240527\`;`
};

export const consultasEspacialesPostgreSQL = {
  lineas: `SELECT * FROM sigetiescritorio.lineascolindantes_ln;`,
  territorios: `SELECT * FROM sigetiescritorio.territoriosindigenas_pg;`
}