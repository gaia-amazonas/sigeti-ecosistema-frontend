import haceClausulasWhere from "../clausulas";

type Query = (datosParaConsultar: { comunidadesId: string[], territoriosId: string[] }, territoriosPrivados?: string[]) => string;

const funciones: Record<string, Query> = {
    mujeresEnEdadFertil: ({ comunidadesId }, territoriosPrivados) => `
        SELECT
            id_cnida AS comunidadId,
            id_ti AS territorioId,
            total_mujeres AS totalMujeres,
            mujeres_en_edad_fertil AS mujeresEnEdadFertil,
            proporcion_mujeres_en_edad_fertil as proporcionMujeresEnEdadFertil
        FROM
            \`sigeti.censo_632.mujeres_edad_fertil\`
        WHERE
            ${haceClausulasWhere({ comunidadesId }, 'id_cnida')} AND
            (${haceClausulasWhere({ territoriosPrivados }, 'id_ti')});`,
    territorios: ({ territoriosId }) => `
        SELECT DISTINCT
            ST_AsGeoJSON(geo) AS geometry,
            ID_TI AS id,
            NOMBRE_TI AS nombre
        FROM
            \`sigeti-admin-364713.analysis_units.TerritoriosIndigenas_Vista\`
        WHERE
            ${haceClausulasWhere({ territoriosId }, 'ID_TI')};`,
    comunidadesEnTerritorios: ({ comunidadesId }) => `
        SELECT
            ST_AsGeoJSON(geo) AS geometry,
            NOMB_CNIDA AS nombre,
            ID_CNIDA AS id
        FROM
            \`sigeti-admin-364713.analysis_units.Comunidades_Vista\`
        WHERE
            ${haceClausulasWhere({ comunidadesId }, 'ID_CNIDA')};`
};

export default funciones;
