// src/consultas/bigQuery/alfanumerico/cultural/porTodasComunidadesEnTodosTerritorios.ts

const funciones = {
    pueblosPorTerritorio: `
        SELECT
            cpt.id_ti AS territorioId,
            cp.PUEBLO AS pueblo,
            SUM(cp.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Pueblos\` cp
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cpt
        ON
            cpt.id_cnida = cp.ID_CNIDA
        GROUP BY
            cp.PUEBLO, cpt.id_ti;`,
    lenguas: `
        SELECT
            dl.ID_CNIDA as comunidadId,
            dl.LENGUA_HAB AS lengua,
            SUM(dl.NUM_HAB) AS conteo
        FROM
            \`sigeti.censo_632.Distribución_Lenguas\` dl
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cpt
        ON
            dl.ID_CNIDA = cpt.id_cnida
        GROUP BY
            dl.LENGUA_HAB, dl.ID_CNIDA;`
    ,
    etnias: `
        SELECT
            ce.ID_CNIDA AS comunidadId,
            ce.ETNIA AS etnia,
            SUM(ce.CONTEO) AS conteo
        FROM
            \`sigeti.censo_632.Conteo_Etnias\` ce
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cp
        ON
            ce.ID_CNIDA = cp.id_cnida
        GROUP BY
            ce.ETNIA, ce.ID_CNIDA;`
    ,
    clanes: `
        SELECT
            id_cnida AS comunidadId,
            clan,
            COUNT(*) AS conteo
        FROM
            \`sigeti.censo_632.BD_personas\`
        GROUP BY
            clan, id_cnida;`
    };

export default funciones;