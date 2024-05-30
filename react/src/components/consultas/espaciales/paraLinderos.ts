// src/consultas/espaciales/paraLinderos.ts
const consultasEspaciales = {
  lineas: `
    SELECT
      OBJECTID, ST_AsGeoJSON(geo) AS geometry
    FROM
      \`sigeti-admin-364713.analysis_units.LineasColindantes\`;
  `,
};

export default consultasEspaciales;