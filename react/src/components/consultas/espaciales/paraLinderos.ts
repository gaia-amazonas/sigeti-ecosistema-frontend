// src/consultas/espaciales/paraLinderos.ts
const consultasEspaciales = {
  lineas: `
    SELECT
      ST_AsGeoJSON(geo) AS geometry,
      OBJECTID,
    FROM
      \`sigeti-admin-364713.analysis_units.LineasColindantes\`;
  `,
  territorios: `
    SELECT
      ST_AsGeoJSON(geometry) AS geometry,
      id_ti,
      territorio
    FROM
      \`sigeti.unidades_de_analisis.territorios_censo632\`;`
};

export default consultasEspaciales;