// src/consultas/espaciales/paraLinderos.ts
const consultasEspaciales = {
  lineas: `
    SELECT
      OBJECTID, ST_AsGeoJSON(geo) AS geometry
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