// src/consultas/bigQuery/paraLineasColindantes.ts
const consultasBigQueryParaLineasColindantes = {
    geometrias: `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            OBJECTID,
        FROM
            \`sigeti-admin-364713.analysis_units.LineasColindantes_Vista\`;`
    ,
    gestionDocumentalLineaColindante: (lineaId: string) => `
        SELECT
            LC.COL_ENTRE,
            TID.ACUERDO,
            TID.FECHA_INICIO,
            TID.LUGAR,
            TID.TIPO_DOC,
            TID.ESCENARIO,
            TID.NOM_ESCENARIO,
            TID.DES_DOC,
            TID.LINK_DOC,
            LC.ACTA_COL,
            LC.PV_1,
            LC.PV_2
        FROM
            \`sigeti-admin-364713.analysis_units.LineasColindantes_Vista\` AS LC
        JOIN
            \`sigeti-admin-364713.Gestion_Documental.TablaInventarioDocumentos\` AS TID
        ON
            LC.ID_DOC = TID.ID_DOC
        WHERE
            OBJECTID = ${lineaId};`
};

export default consultasBigQueryParaLineasColindantes;