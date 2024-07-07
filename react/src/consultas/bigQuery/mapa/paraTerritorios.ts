// src/consultas/bigQuery/paraTerritorios.ts
const consultasBigQueryParaTerritorios = {
    geometrias: `
        SELECT
            ST_AsGeoJSON(geometry) AS geometry,
            id_ti ID_TI,
            territorio NOMBRE_TI,
            CONCAT("TI", SUBSTRING(territorio, 21)) ABREV_TI
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\`;`
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