// src/consultas/bigQuery/alfanumerico/general/dinamicas/porComunidadesEnTerritorio.ts
import haceClausulasWhere from "../../clausulas";

interface DatosParaConsultar {
  comunidadesId: string[];
  territoriosId: string[];
}

type Query = (datosParaConsultar: DatosParaConsultar, edades: {edadMinima: number, edadMaxima: number}) => string;

const funciones: Record<string, Query> = {
  sexo: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        SEXO AS sexo,
        COUNT(*) AS cantidad
    FROM
        \`sigeti-admin-364713.050_censo.sexo_y_edad_por_comunidad_y_territorio\`
    WHERE
        ${haceClausulasWhere({ comunidadesId }, 'ID_CNIDA')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
        SEXO;`
  ,
  poblacionPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        ID_CNIDA AS comunidadId,
        COMUNIDAD AS comunidadNombre,
        COUNT(DISTINCT ID_PERS) AS poblacionTotal
    FROM
        \`sigeti-admin-364713.050_censo.poblacion_edad_por_comunidad_y_territorio\`
    WHERE
        ${haceClausulasWhere({ comunidadesId }, 'ID_CNIDA')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
        ID_CNIDA, COMUNIDAD;`
  ,
  familias: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        COUNT(DISTINCT ID_FORM) AS familias
    FROM
        \`sigeti-admin-364713.050_censo.familias_y_edad\`
    WHERE
        ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima};`
  ,
  familiasPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        COUNT(DISTINCT ID_FORM) AS familias,
        ID_CNIDA as comunidadId,
        COMUNIDAD AS comunidadNombre
    FROM
        \`sigeti-admin-364713.050_censo.familias_y_edad\`
    WHERE
        ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')}
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
        COMUNIDAD, ID_CNIDA;`
  ,
  familiasConElectricidadPorComunidad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        COUNT(*) AS familias,
        ID_CNIDA AS comunidadId,
        COMUNIDAD AS comunidadNombre
    FROM
        \`sigeti-admin-364713.050_censo.familias_edad_electricidad_comunidad_territorio\`
    WHERE
        ${haceClausulasWhere({comunidadesId}, 'ID_TI')}
        AND LOWER(VV_ELECT) IN ('sí', 'si')
        AND edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
        ID_CNIDA, COMUNIDAD;`
  ,
  sexoEdad: ({ comunidadesId }, { edadMinima, edadMaxima }) => `
    SELECT
        grupoPorEdad, sexo, SUM(contador) AS contador
    FROM
        \`sigeti-admin-364713.050_censo.sexos_conedad_por_edades_en_comunidades\`
    WHERE
        ${haceClausulasWhere({comunidadesId}, 'ID_CNIDA')} AND
        edad BETWEEN ${edadMinima} AND ${edadMaxima}
    GROUP BY
        grupoPorEdad, sexo, ordenGrupoPorEdad
    ORDER BY
        ordenGrupoPorEdad;`
  ,
  territorios: ({ territoriosId }) => `
    SELECT DISTINCT
        ST_AsGeoJSON(geo) AS geometry,
        ID_TI AS id,
        NOMBRE_TI AS nombre
    FROM
        \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
    WHERE
        ${haceClausulasWhere({territoriosId}, 'ID_TI')};`
  ,
  comunidadesEnTerritorios: ({ comunidadesId }) => `
    SELECT
      ST_AsGeoJSON(geometry) AS geometry,
      id_cnida AS id,
      nomb_cnida AS nombre
    FROM
      \`sigeti.unidades_de_analisis.comunidades_censo632\`
    WHERE
      ${haceClausulasWhere({ comunidadesId }, 'id_cnida')};`,

  comunidadesAgregadasEnTerritorios: ({ territoriosId }) => `
    SELECT
        ST_AsGeoJSON(geo) AS geometry,
        NOMB_CNIDA AS nombre,
        ID_CNIDA AS id
    FROM
        \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
    WHERE
        ${haceClausulasWhere({territoriosId}, 'ID_CNIDA')};`
};

export default funciones;