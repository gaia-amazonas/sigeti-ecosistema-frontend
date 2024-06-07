// src/consultas/bigQuery/paraTerritorios.ts
const consultasBigQueryParaTerritorios = {
    geometrias: `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI,
            NOMBRE_TI,
            ABREV_TI
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_20240527\`;`
    ,
    gestionDocumentalTerritorio: (territorioId: string) => `
        SELECT
            LUGAR,
            TIPO_DOC,
            ESCENARIO,
            LINK_DOC,
            DES_DOC,
            FECHA_FIN,
            FECHA_INICIO
        FROM
            \`sigeti-admin-364713.Gestion_Documental.TablaInventarioDocumentos\`
        WHERE
            TERRITORIO = '${territorioId}';`
}

export default consultasBigQueryParaTerritorios;