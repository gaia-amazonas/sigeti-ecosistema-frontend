// src/consultas/espaciales/paraTerritorios.ts
export const consultasEspacialesBigQueryParaTerritorios = {  
    territorios: `
        SELECT
        ST_AsGeoJSON(geo) AS geometry,
        ID_TI AS id_ti,
        NOMBRE_TI AS territorio
        FROM
        \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_20240527\`;`
}