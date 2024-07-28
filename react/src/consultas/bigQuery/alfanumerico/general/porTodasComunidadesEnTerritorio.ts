// src/consultas/bigQuery/alfanumerico/general/porTodasComunidadesEnTerritorio.ts
import haceClausulasWhere from "../clausulas";

interface DatosParaConsultar {
    territoriosId: string[];
    comunidadesId: string[];
}
type Query = (datosParaConsultar: DatosParaConsultar) => string;

const funciones: Record<string, Query> = {
    sexo: ({territoriosId}) => `
        SELECT
            sexo,
            SUM(cantidad) AS cantidad
        FROM
            \`sigeti-admin-364713.050_censo.sexos_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
        GROUP BY
            sexo;`
    ,
    poblacionPorComunidad: ({territoriosId}) => `
        SELECT
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre,
            SUM(personas) AS poblacionTotal
        FROM
            \`sigeti-admin-364713.050_censo.poblacion_por_comunidad_y_territorio\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'id_ti')}
        GROUP BY
            ID_CNIDA, COMUNIDAD;`
    ,
    familias: ({territoriosId}) => `
        SELECT
            SUM(familias) AS familias
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
    ,
    familiasPorComunidad: ({territoriosId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA as comunidadId,
            COMUNIDAD AS comunidadNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
        GROUP BY
            COMUNIDAD, ID_CNIDA;`
    ,
    familiasConElectricidadPorComunidad: ({territoriosId}) => `
        SELECT
            SUM(familias) AS familias,
            ID_CNIDA AS comunidadId,
            COMUNIDAD AS comunidadNombre
        FROM
            \`sigeti-admin-364713.050_censo.familias_con_electricidad_por_comunidad_y_t\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
        GROUP BY
            ID_CNIDA, COMUNIDAD;`
    ,
    sexoEdad: ({territoriosId}) => `
        SELECT
            grupoPorEdad, sexo, SUM(contador) AS contador
        FROM
            \`sigeti-admin-364713.050_censo.sexos_por_edades_en_territorios\`
        WHERE
            ${haceClausulasWhere({territoriosId}, 'ID_TI')}
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
    comunidadesEnTerritorio: ({territoriosId}) => `
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
    
};

export default funciones;