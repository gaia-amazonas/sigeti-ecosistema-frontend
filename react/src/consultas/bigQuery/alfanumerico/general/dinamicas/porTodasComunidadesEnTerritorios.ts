// src/consultas/bigQuery/alfanumerico/general/dinamicas/porTodasComunidadesEnTerritorios.ts
import haceClausulasWhere from "../../clausulas";

interface DatosParaConsultar {
    territoriosId: string[];
    comunidadesId: string[];
}
type Query = (datosParaConsultar: DatosParaConsultar, edades: {edadMinima: number, edadMaxima: number}) => string;

const funciones: Record<string, Query> = {
    sexo: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            SEXO AS sexo,
            COUNT(*) AS cantidad
        FROM
            \`sigeti-admin-364713.050_censo.sexo_y_edad_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({ territoriosId }, 'ID_TI')}
            AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
        GROUP BY
            SEXO;`
    ,
    poblacionPorComunidad: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre,
            COUNT(DISTINCT ID_PERS) AS poblacionTotal
        FROM
            \`sigeti-admin-364713.050_censo.poblacion_edad_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({ territoriosId }, 'ID_TI')}
            AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
        GROUP BY
            ID_CNIDA, COMUNIDAD;`
    ,
    familias: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            COUNT(DISTINCT ID_FORM) AS familias
        FROM
            sigeti-admin-364713.050_censo.familias_y_edad
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
            AND edad BETWEEN ${edadMinima} AND ${edadMaxima};`
    ,
    familiasPorComunidad: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            COUNT(DISTINCT ID_FORM) AS familias,
            ID_CNIDA as comunidadId,
            COMUNIDAD AS comunidadNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias_y_edad\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
            AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
        GROUP BY
            COMUNIDAD, ID_CNIDA;`
    ,
    familiasConElectricidadPorComunidad: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            COUNT(*) AS familias,
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias_edad_electricidad_comunidad_territorio\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
            AND LOWER(VV_ELECT) IN ('sí', 'si')
            AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
        GROUP BY
            ID_CNIDA, COMUNIDAD;`
    ,
    sexoEdad: ({territoriosId}, {edadMinima, edadMaxima}) => `
        SELECT
            grupoPorEdad, sexo, SUM(contador) AS contador
        FROM
            \`sigeti-admin-364713.050_censo.sexos_conedad_por_edades_en_territorios\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')} AND
            edad BETWEEN ${edadMinima} AND ${edadMaxima}
        GROUP BY
            grupoPorEdad, sexo, ordenGrupoPorEdad
        ORDER BY
            ordenGrupoPorEdad;`
    ,
    territorios: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    comunidadesEnTerritorios: ({territoriosId}) => `
        SELECT
            ST_AsGeoJSON(g.geo) AS geometry,
            g.NOMB_CNIDA AS nombre,
            g.ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\` g
        JOIN
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\` rcpt
        ON
            g.ID_CNIDA = rcpt.id_cnida
        WHERE
            ${haceClausulasWhere({territoriosId}, 'g.ID_TI')};`
    ,
    comunidadesAgregadasEnTerritorios: ({territoriosId}) => `
        SELECT
            territorio AS territorioId,
            ARRAY_AGG(comunidad) AS comunidadesId
        FROM
            \`sigeti.censo_632.representacion_comunidades_por_territorio_2\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            territorio;`
};

export default funciones;
