// src/consultas/bigQuery/alfanumerico/general/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: {comunidadesId: string[], territoriosId: string[]}) => string;

const funciones: Record<string, Query> = {
    sexo: ({comunidadesId}) => `
        SELECT
            sexo,
            SUM(cantidad) AS cantidad 
        FROM
            \`sigeti-admin-364713.050_censo.sexos_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            sexo;`
    ,
    poblacionPorComunidad: ({comunidadesId}) => `
        SELECT
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre,
            ID_TI as territorioId,
            SUM(personas) AS poblacionTotal
        FROM
            \`sigeti-admin-364713.050_censo.poblacion_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'id_cnida')}
        GROUP BY
            ID_CNIDA, COMUNIDAD, ID_TI, TERRITORIO;`
    ,
    familias: ({comunidadesId}) => `
        SELECT
            SUM(familias) as familias
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')};`
    ,
    familiasPorComunidad: ({comunidadesId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA as comunidadId,
            COMUNIDAD AS comunidadNombre,
            ID_TI AS territorioId,
            TERRITORIO AS territorioNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            COMUNIDAD, ID_CNIDA, ID_TI, TERRITORIO;`
    ,
    familiasConElectricidadPorComunidad: ({comunidadesId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA AS comunidadId,
            ID_TI AS territorioId
        FROM
            \`sigeti-admin-364713.050_censo.familias_con_electricidad_por_comunidad_y_t\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            ID_CNIDA, ID_TI;`
    ,
    sexoEdad: ({comunidadesId}) => `
        SELECT
            grupoPorEdad, sexo, SUM(contador) AS contador
        FROM
            \`sigeti-admin-364713.050_censo.sexos_por_edades_en_comunidades\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        GROUP BY
            grupoPorEdad, sexo, ordenGrupoPorEdad
        ORDER BY
            ordenGrupoPorEdad;`
    ,
    territorio: ({territoriosId}) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    comunidadesEnTerritorio: ({comunidadesId}) => `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nombre,
            ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
        WHERE
            ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')};`
    };


export default funciones;