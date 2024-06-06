// src/consultas/generales/porLineaColindante.ts

const porLineasColindantes = {
    gestion_documental_linea_colindante: (lineaId: string) => `
    SELECT
        LC.COL_ENTRE,
        TID.ACUERDO,
        TID.FECHA_INICIO,
        TID.LUGAR,
        TID.TIPO_DOC,
        TID.ESCENARIO,
        TID.NOM_ESCENARIO,
        TID.DES_DOC,
        TID.LINK_DOC
    FROM
        \`sigeti-admin-364713.analysis_units.LineasColindantes\` AS LC
    JOIN
        \`sigeti-admin-364713.Gestion_Documental.TablaInventarioDocumentos\` AS TID
    ON
        LC.ID_DOC = TID.ID_DOC
    WHERE
        OBJECTID = ${lineaId};`
}

export default porLineasColindantes;